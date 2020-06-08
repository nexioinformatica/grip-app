import { Operators, NewMovement, Movement } from "../types/Api";
import { AxiosInstance, AxiosResponse } from "axios";
import * as TE from "fp-ts/lib/TaskEither";

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

// export const getReasons = (i: AxiosInstance) => (): TE.TaskEither<
//   Error,
//   AxiosResponse<Reasons>
// > => {
//   return TE.tryCatch<Error, AxiosResponse>(
//     () => i.get<Reasons>("api/v1/causali-magazzino"),
//     (reason) => new Error(String(reason))
//   );
// };

export const postMovement = (i: AxiosInstance) => (
  movement: NewMovement
): TE.TaskEither<Error, AxiosResponse<Movement>> => {
  return TE.tryCatch<Error, AxiosResponse<Movement>>(
    () => i.post<Movement>("api/v1/movimenti-magazzino", { data: movement }),
    (reason) => new Error(String(reason))
  );
};
