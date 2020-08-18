import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Auth, Authentication } from "geom-api-ts-client";
import moment from "moment";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AsyncStorage } from "react-native";

import { User } from "../types";
import { makeSettings } from "../util/api";
import { noop } from "../util/noop";
import { ErrorContext } from "./error";

const USER_STORAGE_KEY = "user";

interface Context {
  user: () => User | undefined;
  logout: () => void;
  login: (data: User) => void;
  refresh: () => void;
}

export const AuthContext = createContext<Context>({
  user: () => undefined,
  logout: noop,
  login: (_: User) => noop,
  refresh: noop,
});

export function AuthContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const { setError } = useContext(ErrorContext);
  const [_user, setUser] = useState<undefined | User>(undefined);

  const tryRefresh = (u: User): T.Task<Auth.Token> =>
    pipe(
      Authentication.refresh({
        value: {
          refresh_token: u.token.refresh_token,
          grant_type: "refresh_token",
        },
        settings: makeSettings(),
      }),
      TE.fold(
        (_) => {
          return T.never;
        },

        (res) => {
          setUser(makeUser(u.username)(res));
          return T.of(res);
        }
      )
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
    })();
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

  const user = () => {
    if (!_user) {
      throw new Error("Login needed");
    }

    return _user;
  };

  const login = (user: User): void => {
    setUser(user);
  };

  const logout = () => setUser(undefined);

  const refresh = () => {
    if (!_user) return;

    tryRefresh(_user)();
  };

  return (
    <AuthContext.Provider
      value={{ user: user, logout: logout, login: login, refresh: refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const makeUser = (username: string) => (token: Auth.Token): User => {
  return {
    username: username,
    timestamp: moment(),
    token: token,
  };
};

/** Json reviver for user object. */
// tslint:disable-next-line:no-explicit-any
const userReviver = (k: string, v: any) => {
  if (k === "timestamp") return moment(v);
  return v;
};
