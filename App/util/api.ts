import axios, { AxiosInstance } from "axios";
import { BASE_URL, API_KEY, API_CLIENT_TIMEOUT } from "./constants";
import { Token } from "../types";
import * as T from "fp-ts/lib/Task";

/** @returns A request application defaults and giben token as authorization. */
export const req = (token: Token): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: API_CLIENT_TIMEOUT,
    headers: {
      "X-ApiKey": API_KEY,
      Authorization: "Bearer " + token.access_token,
    },
  });
};

/** @returns A request with application defaults and no authentication. */
export const publicReq = (): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: API_CLIENT_TIMEOUT,
    headers: {
      "X-ApiKey": API_KEY,
    },
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
