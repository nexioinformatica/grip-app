import axios, { AxiosInstance } from "axios";
import { BASE_URL, API_KEY } from "../constants";
import { Token } from "../types";
import * as T from "fp-ts/lib/Task";

export const req = (token: Token): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "X-ApiKey": API_KEY,
      Authorization: "Bearer " + token.access_token,
    },
  });
};

export const neededLogin = <Default>(
  setError: (err: Error) => void,
  def: Default
): T.Task<Default> => {
  setError(new Error("You should be signed in"));
  return T.of(def);
};

export const errorOccurred = <Default>(
  setError: (err: Error) => void,
  err: Error,
  def: Default
): T.Task<Default> => {
  setError(err);
  return T.of(def);
};
