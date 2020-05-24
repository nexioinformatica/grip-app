import { Token, Login } from "../types";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";

const login = (data: Login): Token => {
  return {
    access_token: "aa",
    expires_in: 100,
    token_type: "Bearer",
    refresh_token: "bbb",
  };
};

const refresh = (data: Token): Token => {
  return {
    access_token: "aa",
    expires_in: 100,
    token_type: "Bearer",
    refresh_token: "bbb",
  };
};

export const token = (auth: E.Either<Login, Token>): Token => {
  return pipe(
    auth,
    E.fold(
      (data) => login(data),
      (data) => refresh(data)
    )
  );
};
