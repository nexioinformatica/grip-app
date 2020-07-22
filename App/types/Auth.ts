import moment from "moment";

export interface User {
  username: string;
  timestamp: moment.Moment;
  token: Token;
}

export interface Login {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

// tslint:disable-next-line:no-explicit-any
export const userReviver = (k: string, v: any) => {
  if (k === "timestamp") return moment(v);
  return v;
};

export const buildUser = (username: string) => (token: Token): User => {
  return {
    username: username,
    timestamp: moment(),
    token: token,
  };
};
