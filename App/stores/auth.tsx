import React, { createContext, useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";
import moment from "moment";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { noop } from "../util/noop";
import { Login, Token, User } from "../types";
import { login as postLogin } from "../data/auth";
import { refresh as postRefresh } from "../data/auth";
import { ErrorContext } from "./error";
import { publicReq } from "../util/api";

const USER_STORAGE_KEY = "user";

/** Json reviver for user object. */
// tslint:disable-next-line:no-explicit-any
const userReviver = (k: string, v: any) => {
  if (k === "timestamp") return moment(v);
  return v;
};

/** The Auth Context type */
interface Context {
  user?: User;
  logout: () => void;
  login: (data: E.Either<Login, Token>) => TE.TaskEither<Error, User>;
  // auth: () => void;
}

/** @returns A user with given username, a timestamp and a token. */
const buildUser = (username: string) => (token: Token): User => {
  return {
    username: username,
    timestamp: moment(),
    token: token,
  };
};

export const AuthContext = createContext<Context>({
  user: undefined,
  logout: noop,
  login: (data: E.Either<Login, Token>) => T.never,
});

export function AuthContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const { setError } = useContext(ErrorContext);
  const [user, setUser] = useState<undefined | User>(undefined);

  useEffect(() => {
    // Try to retrieve and decode the user saved in the async storage, if any.
    (async () => {
      try {
        const s = await AsyncStorage.getItem(USER_STORAGE_KEY);
        const u = JSON.parse(s || "", userReviver);

        if (!u) setUser(undefined);
        else setUser(u);
      } catch (err) {
        setUser(undefined);
      }
    })();
  }, []);

  useEffect(() => {
    // Update the async storage according the modifications done to the user object in te state,
    // i.e., update the user with it's json string or delete the key if user is undefined.
    (async () => {
      try {
        if (!user) AsyncStorage.removeItem(USER_STORAGE_KEY);
        else await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } catch (err) {
        setError(err);
      }
    })();
  }, [user]);

  /** Login the user either with login or token data. */
  const login = (data: E.Either<Login, Token>): TE.TaskEither<Error, User> => {
    return pipe(
      data,
      E.fold(
        (loginData) =>
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
          ),
        (tokenData) =>
          pipe(
            pipe(publicReq(), postRefresh)(tokenData),
            TE.fold(
              (err) => TE.left(err),
              (res) => {
                if (user) {
                  // do the side effect
                  const newUser = { ...user, token: res.data };
                  setUser(newUser);
                  return TE.right(newUser);
                } else {
                  // should not get here
                  return TE.left(
                    new Error("User is not logged in, cannot refresh token")
                  );
                }
              }
            )
          )
      )
    );
  };

  /** Logout the user. */
  const logout = () => setUser(undefined);

  return (
    <AuthContext.Provider value={{ user: user, logout: logout, login: login }}>
      {children}
    </AuthContext.Provider>
  );
}
