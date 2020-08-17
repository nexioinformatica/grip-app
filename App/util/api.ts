import axios, { AxiosInstance, CancelToken, CancelTokenSource } from "axios";
import {
  BASE_URL,
  API_KEY,
  API_CLIENT_REQUEST_TIMEOUT,
  API_CLIENT_CONNECTION_TIMEOUT,
} from "./constants";
import { Token } from "../types";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { sentryError } from "./sentry";
import { Settings, makeSignal } from "geom-api-ts-client/dist/common/api";

/**
 * Create an abort token to cancel request if connection fails.
 * For further details see https://github.com/axios/axios/issues/647.
 *
 * **Important note**: the setTimeout function is executed when this function
 * is executed. Do not beat around the bush (tergiversare, in italian) with
 * this abort token.
 */
const createAbortToken = (): CancelTokenSource => {
  let abort = axios.CancelToken.source();
  setTimeout(
    () =>
      abort.cancel(
        `Request canceled after ${API_CLIENT_CONNECTION_TIMEOUT}ms.`
      ),
    API_CLIENT_CONNECTION_TIMEOUT
  );
  return abort;
};

/** @returns A request with application defaults and given token as authorization. */
export const req = (token: Token): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: API_CLIENT_REQUEST_TIMEOUT,
    headers: {
      "X-ApiKey": API_KEY,
      Authorization: "Bearer " + token.access_token,
    },
    cancelToken: createAbortToken().token,
  });
};

/** @returns A request with application defaults and no authentication. */
export const publicReq = (): AxiosInstance => {
  let abort = axios.CancelToken.source();
  setTimeout(
    () => abort.cancel(`Timeout of ${API_CLIENT_CONNECTION_TIMEOUT}ms.`),
    API_CLIENT_CONNECTION_TIMEOUT
  );

  return axios.create({
    baseURL: BASE_URL,
    timeout: API_CLIENT_REQUEST_TIMEOUT,
    headers: {
      "X-ApiKey": API_KEY,
    },
    cancelToken: createAbortToken().token,
  });
};

export const neededLogin = <T>(setError: (err: Error) => void): T.Task<T> => {
  setError(new Error("You should be signed in"));
  return T.never;
};

export const errorOccurred = <T>(
  setError: (err: Error) => void,
  err: Error
): T.Task<T> => {
  setError(err);
  return T.never;
};

/**
 * Apply the identity function, and log, as a side effect, the error, if any.
 * @returns The given TaskEither `te`.
 */
export const logErrorIfAny = <T>(
  te: TE.TaskEither<Error, T>
): TE.TaskEither<Error, T> =>
  pipe(
    te,
    TE.fold(
      (err) => {
        sentryError("ApiContext")(err);
        return TE.left(err);
      },
      (res) => TE.right(res)
    )
  );

export const makeSettings = (): Settings => ({
  noVersion: false,
  timeout: API_CLIENT_REQUEST_TIMEOUT,
  apiKey: API_KEY,
  signal: makeSignal(API_CLIENT_CONNECTION_TIMEOUT).token,
  url: BASE_URL,
  useHttp: true,
});
