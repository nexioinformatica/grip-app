import { AxiosInstance, AxiosResponse } from "axios";
import { Token, Login } from "../types";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { API_KEY } from "../util/constants";
import { req, publicReq } from "../util/api";

export const login = (i: AxiosInstance) => (
  data: Login
): TE.TaskEither<Error, AxiosResponse<Token>> => {
  return TE.tryCatch<Error, AxiosResponse<Token>>(
    () =>
      i.post<Token>("token", {
        params: {
          client_id: API_KEY,
          username: data.username,
          password: data.password,
          grant_type: "password",
        },
      }),
    (reason) => new Error(String(reason))
  );
};

export const refresh = (i: AxiosInstance) => (
  data: Token
): TE.TaskEither<Error, AxiosResponse<Token>> => {
  return TE.tryCatch<Error, AxiosResponse<Token>>(
    () =>
      i.post<Token>("token", {
        params: {
          grant_type: "refresh_token",
          refresh_token: data.refresh_token,
        },
      }),
    (reason) => new Error(String(reason))
  );
};
