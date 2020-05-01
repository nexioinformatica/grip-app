import React, { createContext, useState, useEffect, useContext } from "react";

import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";

import { noop } from "../util/noop";
import { AsyncStorage } from "react-native";
import { ErrorContext } from "./error";
import { ApiContext } from "./api";
// import { ErrorContext } from "./error";

/**
 * The JWT token interface.
 */
export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: string;
  refresh_token: string;
}

/**
 * The authentication data, i.e.,
 *  - the authentication token,
 *  - the timestamp of the last successful authentication,
 *  - the username of the user logged in.
 */
export interface AuthData {
  authToken: AuthToken;
  timestamp: number;
  username: string;
}

/**
 * The authentication context.
 */
export interface Context {
  auth?: AuthData;
  logout: () => void;
  login: (username: string, password: string) => void;
}

const buildUser = (username: string, authToken: AuthToken): AuthData => ({
  authToken: authToken,
  timestamp: new Date().getMilliseconds(),
  username: username,
});

export const AuthContext = createContext<Context>({
  auth: undefined,
  logout: noop,
  login: noop,
});

export function AuthContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const [auth, setAuth] = useState<AuthData | undefined>(undefined);
  const { setError } = useContext(ErrorContext);
  const { api } = useContext(ApiContext);

  if (!api) throw new Error("ApiContext needs to be initialized.");

  const login = (username: string, password: string) => {
    pipe(
      api.token(username, password),
      TE.fold(
        (err) => {
          setError(err);
          return T.of(undefined);
        },
        (authToken) => {
          setAuth(buildUser(username, authToken));
          return T.of(undefined);
        }
      )
    )();
  };

  // useEffect(() => {
  //   loginPipe("test", "secret"); // TODO: change hardcoded login
  // }, []);

  const logout = () => setAuth(undefined);

  return (
    <AuthContext.Provider value={{ auth, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}
