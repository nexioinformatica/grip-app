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
