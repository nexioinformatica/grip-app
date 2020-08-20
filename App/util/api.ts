import {
  API_BASE_URL,
  API_KEY,
  API_CLIENT_REQUEST_TIMEOUT,
  API_CLIENT_CONNECTION_TIMEOUT,
  API_USE_HTTP,
} from "./constants";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { sentryError } from "./sentry";
import { Settings, makeSignal } from "geom-api-ts-client/dist/common/api";

export const neededLogin = <T>(setError: (err: Error) => void): T.Task<T> => {
  setError(new Error("You should be signed in"));
  return T.never;
};

/**
 * Apply the identity function and log, as a side effect, the error
 * with sentry if any.
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

/**
 * Make default settings for GeOM API client with `.env` values.
 */
export const makeSettings = (
  settings = {
    noVersion: false,
    timeout: API_CLIENT_REQUEST_TIMEOUT,
    apiKey: API_KEY,
    signal: makeSignal(API_CLIENT_CONNECTION_TIMEOUT).token,
    url: API_BASE_URL,
    useHttp: API_USE_HTTP,
  }
): Settings => settings;
