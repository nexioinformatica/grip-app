import {
  Operators,
  NewMovement,
  Movement,
  BarcodeDecode,
  StartProcessing,
} from "../types/Api";
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

export const postMovement = (i: AxiosInstance) => (
  movement: NewMovement
): TE.TaskEither<Error, AxiosResponse<Movement>> => {
  return TE.tryCatch<Error, AxiosResponse<Movement>>(
    () => i.post<Movement>("api/v1/movimenti-magazzino", movement),
    (reason) => new Error(String(reason))
  );
};

export const postBarcodeDecode = (i: AxiosInstance) => (
  barcode: string
): TE.TaskEither<Error, AxiosResponse<BarcodeDecode[]>> => {
  return TE.tryCatch<Error, AxiosResponse<BarcodeDecode[]>>(
    () => i.post<BarcodeDecode[]>("api/v1/barcode-decode", { Codice: barcode }),
    (reason) => new Error(String(reason))
  );
};

export const postStartProcessing = (i: AxiosInstance) => (
  startProcessing: StartProcessing
): TE.TaskEither<Error, AxiosResponse<StartProcessing>> => {
  return TE.tryCatch<Error, AxiosResponse<StartProcessing>>(
    () => i.post<BarcodeDecode[]>("api/v1/attivita", startProcessing),
    (reason) => new Error(String(reason))
  );
};
