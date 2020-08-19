import moment from "moment";
import { Auth } from "geom-api-ts-client";

export interface User {
  username: string;
  timestamp: moment.Moment;
  token: Auth.Token;
}

export const getExpiringIn = (user?: User): string =>
  user
    ? user.timestamp.clone().add(user?.token.expires_in, "seconds").fromNow()
    : "";
