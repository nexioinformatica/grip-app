import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { Auth, Authentication } from "geom-api-ts-client";
import moment from "moment";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AsyncStorage } from "react-native";

import { User } from "../types";
import { makeSettings, logErrorIfAny } from "../util/api";
import { noop } from "../util/noop";
import { ErrorContext } from "./error";
import { API_KEY } from "../util/constants";

const USER_STORAGE_KEY = "user";

type Token = Auth.Token;

interface Context {
  user: User | undefined;
  logout: () => void;
  login: (data: User) => void;
  /**
   * Refresh the token. If force is true, the token is refreshed even if it is not expiring.
   */
  refresh: (force?: boolean) => void;
  isReady: boolean;
}

export const AuthContext = createContext<Context>({
  user: undefined,
  logout: noop,
  login: noop,
  refresh: noop,
  isReady: false,
});

export function AuthContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const { setError } = useContext(ErrorContext);
  const [_user, setUser] = useState<undefined | User>(undefined);
  const [isReady, setReady] = useState<boolean>(false);

  const getRefresh = (u: User): TE.TaskEither<Error, Token> =>
    pipe(
      Authentication.refresh({
        value: {
          refresh_token: u.token.refresh_token,
          grant_type: "refresh_token",
          client_id: API_KEY,
        },
        settings: makeSettings(),
      }),
      logErrorIfAny
    );

  useEffect(() => {
    // Try to retrieve and decode the user saved in the async storage, if any.
    (async () => {
      try {
        const s = await AsyncStorage.getItem(USER_STORAGE_KEY);
        const u = JSON.parse(s || "", userReviver) as User;

        if (!u) {
          setUser(undefined);
          return T.never;
        }

        setUser(u);
      } catch (err) {
        setUser(undefined);
      }
    })().then(() => {
      setReady(true);
    });
  }, []);

  useEffect(() => {
    // Update the async storage according the modifications done to the user object in te state,
    // i.e., update the user with it's json string or delete the key if user is undefined.
    (async () => {
      try {
        if (!_user) AsyncStorage.removeItem(USER_STORAGE_KEY);
        else
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(_user));
      } catch (err) {
        setError(err);
      }
    })();
  }, [_user]);

  const user = _user;

  const login = (user: User): void => {
    setUser(user);
  };

  const logout = () => setUser(undefined);

  const refresh = (force = false) => {
    return pipe(
      _user,
      O.fromNullable,
      O.fold(
        () => abortIfNotUser<Token>(),
        (user) =>
          pipe(
            refreshTokenIfIsExpiringOrForce(getRefresh)(force)(user),
            TE.fold(
              (err) => TE.left(err),
              (newToken) => {
                setUser(makeUser(user.username)(newToken));
                return TE.right(newToken);
              }
            )
          )
      ),
      logErrorIfAny
    )();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        logout: logout,
        login: login,
        refresh: refresh,
        isReady: isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const makeUser = (username: string) => (token: Token): User => {
  return {
    username: username,
    timestamp: moment(),
    token: token,
  };
};

const isTokenExpiring = (user: User): boolean =>
  moment().isAfter(
    user.timestamp.clone().add((user.token.expires_in * 80) / 100, "seconds")
  );

const refreshTokenIfIsExpiring = (
  getRefresh: (user: User) => TE.TaskEither<Error, Token>
) => (user: User) =>
  pipe(
    user,
    O.fromPredicate(isTokenExpiring),
    O.fold(
      // token is not expiring
      () => TE.right(user.token),
      // token is expiring
      () => getRefresh(user)
    )
  );

const refreshTokenIfIsExpiringOrForce = (
  getRefresh: (user: User) => TE.TaskEither<Error, Token>
) => (force: boolean) => (user: User) =>
  pipe(
    force,
    O.fromPredicate((x) => !x),
    O.fold(
      // force refresh
      () => getRefresh(user),
      // refresh only if expiring
      () => refreshTokenIfIsExpiring(getRefresh)(user)
    )
  );

const abortIfNotUser = <T,>(): TE.TaskEither<Error, T> =>
  TE.left(new Error("Cannot refresh token, user is not logged in."));

/** Json reviver for user object. */
/* eslint-disable  @typescript-eslint/no-explicit-any */
const userReviver = (k: string, v: any): any => {
  if (k === "timestamp") return moment(v);
  return v;
};
