import { Token } from "../types";
import { Operators } from "../types/Api";
import { req } from "../util/api";
import { AxiosPromise, AxiosInstance, AxiosResponse } from "axios";
import { pipe } from "fp-ts/lib/pipeable";
import { flow } from "fp-ts/lib/function";
import { failure } from "io-ts/lib/PathReporter";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as t from "io-ts";
import { noop } from "../util/noop";

export const getOperators = (i: AxiosInstance) => (
  isApiEnabled: boolean,
  isDepartmentEnabled: boolean
): TE.TaskEither<Error, AxiosResponse<Operators>> => {
  return TE.tryCatch<Error, AxiosResponse>(
    () =>
      i.get<Operators>("api/v1/operatori", {
        params: {
          AbilitatoAPI: isApiEnabled,
          AbilitatoAttivitaReparto: isDepartmentEnabled,
        },
      }),
    (reason) => new Error(String(reason))
  );
};

// export const operators = (token: Token) => (
//   isApiEnabled: boolean = true,
//   isDepartmentEnabled: boolean = true
// ): TE.TaskEither<Error, Operators> => {
//   return pipe(
//     pipe(token, req, getOperators)(isApiEnabled, isDepartmentEnabled),
//     TE.map((x) => x.data)
//   );
// };
