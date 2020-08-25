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

/** @returns A string of two uppercase letters, representing name initials. */
export const getInitials = (name: string) => {
  var matched = name.match(/\b\w/g) || [];
  return ((matched.shift() || "") + (matched.pop() || "")).toUpperCase();
};
