import React, { createContext, useState } from "react";

import { noop } from "../util/noop";
import { Config } from "react-native-config";
import { API_KEY, BASE_URL } from "../constants";
import { promiseToTE } from "../util/fp";
import promise, { AggregateError } from "p-any";
import { TaskEither } from "fp-ts/lib/TaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { AuthToken } from "./auth";
import { buildPostReq } from "../util/req";

interface Api {
  token: (
    username: string,
    password: string
  ) => TE.TaskEither<Error, AuthToken>;
  refreshToken: (token: AuthToken) => TE.TaskEither<Error, AuthToken>;
}

interface Context {
  api?: Api;
}

export const ApiContext = createContext<Context>({
  api: undefined,
});

const apiConfig: RequestInit = {
  headers: {
    "X-ApiKey": API_KEY,
  },
};

// function toJson<T>(res: Response): T {
//   const obj:T = JSON.parse(res.)
//   return obj;
// }
function toJson(res: Response) {
  return res.json();
}

const logAny = (obj: any) => {
  console.log(obj);
  return obj;
};

export function ApiContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const [authToken, setAuthToken] = useState<AuthToken | undefined>(undefined);

  const token = (
    username: string,
    password: string
  ): TE.TaskEither<Error, AuthToken> => {
    const tokenPromise = fetch(
      // make the request and get the promise
      BASE_URL + "/token",
      buildPostReq({
        body: new URLSearchParams({
          client_id: API_KEY,
          username: username,
          password: password,
          grant_type: "password",
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          ...apiConfig.headers,
        },
      })
    );
    return promiseToTE(
      // get the result
      () =>
        tokenPromise
          .then(toJson)
          .then((token: AuthToken) => {
            setAuthToken(token);
            return token;
          })
          .catch((errors: AggregateError) => {
            throw new Error(errors.message);
          }),
      "ApiContext"
    );
  };

  const refreshToken = (token: AuthToken) => {
    const refreshTokenPromise = fetch(
      BASE_URL + "/token",
      buildPostReq({
        body: new URLSearchParams({
          refresh_token: token.toString(),
          grant_type: "refresh_token",
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization: "Bearer " + token.toString(),
          ...apiConfig.headers,
        },
      })
    );
    return promiseToTE(
      // get the result
      () =>
        refreshTokenPromise
          .then(logAny)
          .then(toJson)
          .then((token: AuthToken) => {
            setAuthToken(token);
            return token;
          })
          .catch((errors: AggregateError) => {
            throw new Error(errors.message);
          }),
      "ApiContext"
    );
  };

  const api = {
    token: token,
    refreshToken: refreshToken,
  };
  return <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>;
}
