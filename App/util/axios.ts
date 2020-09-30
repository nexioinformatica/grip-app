import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { pipe } from "fp-ts/lib/pipeable";
import { log } from "./fp";

export const intercept = () => {
  interceptRequest();
  interceptResponse();
};

export const interceptRequest = () => {
  axios.interceptors.request.use(logRequest);
};

export const interceptResponse = () => {
  axios.interceptors.response.use(logResponse, logErrorResponse);
};

const logRequest = (x: AxiosRequestConfig) => {
  console.log("Request", pp(x));
  return x;
};

const logResponse = (x: AxiosResponse) => {
  console.log("Response", pp(x));
  return x;
};

const logErrorResponse = (x: AxiosError) => {
  console.log("ErrorResponse", pp(x));
  return x;
};

const pp = <T>(x: T): string => JSON.stringify(x, null, 2);
