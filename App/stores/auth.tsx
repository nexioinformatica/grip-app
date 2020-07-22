import React, { createContext, useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";
import moment from "moment";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { noop } from "../util/noop";
import { Login, Token, User, userReviver, buildUser } from "../types";
import { login as postLogin } from "../data/auth";
import { refresh as postRefresh } from "../data/auth";
import { ErrorContext } from "./error";
import { publicReq } from "../util/api";

const USER_STORAGE_KEY = "user";

interface Context {
  user?: User;
  logout: () => void;
  login: (data: E.Either<Login, Token>) => TE.TaskEither<Error, User>;
}

export const AuthContext = createContext<Context>({
  user: undefined,
  logout: noop,
  login: (_data: E.Either<Login, Token>) => T.never,
});

export function AuthContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const { setError } = useContext(ErrorContext);
  const [user, setUser] = useState<undefined | User>(undefined);

  const getUserFromStorage = async () => {
    try {
      const s = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const u = JSON.parse(s || "", userReviver);

      if (!u) setUser(undefined);
      else setUser(u);
    } catch (err) {
      setUser(undefined);
    }
  };

  const updateUserInStorage = async () => {
    try {
      if (!user) AsyncStorage.removeItem(USER_STORAGE_KEY);
      else await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (err) {
      setError(err);
    }
  };

  const loginUserWithCredentials = (
    loginData: Login
  ): TE.TaskEither<Error, User> =>
    pipe(
      pipe(publicReq(), postLogin)(loginData),
      TE.fold(
        (err) => TE.left(err),
        (res) => {
          const newUser = buildUser(loginData.username)(res.data);
          // do the side effect
          setUser(newUser);
          return TE.right(newUser);
        }
      )
    );

  const loginUserWithToken = (tokenData: Token): TE.TaskEither<Error, User> =>
    pipe(
      pipe(publicReq(), postRefresh)(tokenData),
      TE.fold(
        (err) => TE.left(err),
        (res) => {
          if (user) {
            const newUser = { ...user, token: res.data };
            // do the side effect and log in the user
            setUser(newUser);
            return TE.right(newUser);
          } else {
            return TE.left(
              new Error("User is not logged in, cannot refresh token")
            );
          }
        }
      )
    );

  useEffect(() => {
    getUserFromStorage();
  }, []);

  useEffect(() => {
    updateUserInStorage();
  }, [user]);

  const login = (data: E.Either<Login, Token>): TE.TaskEither<Error, User> => {
    return pipe(
      data,
      E.fold(
        (loginData) => loginUserWithCredentials(loginData),
        (tokenData) => loginUserWithToken(tokenData)
      )
    );
  };

  const logout = () => setUser(undefined);

  return (
    <AuthContext.Provider value={{ user: user, logout: logout, login: login }}>
      {children}
    </AuthContext.Provider>
  );
}
