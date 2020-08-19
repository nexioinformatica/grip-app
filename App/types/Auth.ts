import moment from "moment";
import { Auth } from "geom-api-ts-client";

export interface User {
  username: string;
  timestamp: moment.Moment;
  token: Auth.Token;
}
