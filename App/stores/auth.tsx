import React, { createContext, useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";
import moment from "moment";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import { noop } from "../util/noop";
import { Login, Token, User } from "../types";
import { token as tokenApi } from "../data/auth";
import { ErrorContext } from "./error";

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
  login: (data: E.Either<Login, Token>) => void;
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
  login: noop,
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
  const login = (data: E.Either<Login, Token>) =>
    pipe(
      data,
      E.fold(
        (login) =>
          pipe(tokenApi(E.left(login)), buildUser(login.username), setUser),
        (token) => 1 // TODO: is this useful? Note that we save in the async storage the whole user object not only the token.
      )
    );

  /** Logout the user. */
  const logout = () => setUser(undefined);

  return (
    <AuthContext.Provider value={{ user: user, logout: logout, login: login }}>
      {children}
    </AuthContext.Provider>
  );
}
