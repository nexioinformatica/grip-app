import axios, { AxiosInstance } from "axios";
import { BASE_URL, API_KEY } from "../constants";
import { Token } from "../types";

export const req = (token: Token): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "X-ApiKey": API_KEY,
      Authorization: "Bearer " + token.access_token,
    },
  });
};
