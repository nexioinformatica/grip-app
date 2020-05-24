import React, { createContext, useState, useContext } from "react";

import moment from "moment";

import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";

import { noop } from "../util/noop";
import { ErrorContext } from "./error";
import { Login, Token, User } from "../types";
import { token as tokenApi } from "../data/auth";

export interface Context {
  user?: User;
  logout: () => void;
  login: (data: E.Either<Login, Token>) => void;
  // auth: () => void;
}

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
  // auth: noop,
});

export function AuthContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const [user, setUser] = useState<undefined | User>(undefined);

  const { setError } = useContext(ErrorContext);

  const login = (data: E.Either<Login, Token>) =>
    pipe(
      data,
      E.fold(
        (data) =>
          pipe(tokenApi(E.left(data)), buildUser(data.username), setUser),
        (data) => 1
      )
    );
  const logout = () => setUser(undefined);

  return (
    <AuthContext.Provider value={{ user: user, logout: logout, login: login }}>
      {children}
    </AuthContext.Provider>
  );
}
