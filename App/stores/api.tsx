import React, { createContext, useContext } from "react";

import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";

import { Auth } from "geom-api-ts-client";
import { ErrorContext } from "./error";
import { AuthContext } from "./auth";
import { neededLogin, logErrorIfAny } from "../util/api";
import { Token } from "geom-api-ts-client/dist/auth";

/**
 * This Context inject the token into the API call if it is not
 * public and the user is setted.
 */

export type Call = <T, U>(
  task: (params: U & { token: string | Auth.Token }) => TE.TaskEither<Error, T>
) => (input: U) => TE.TaskEither<Error, T>;

export type CallPublic = <T, U>(
  task: (params: U) => TE.TaskEither<Error, T>
) => (input: U) => TE.TaskEither<Error, T>;

interface Context {
  call: Call;
  callPublic: CallPublic;
}

export const ApiContext = createContext<Context>({
  call: () => () => TE.left(new Error("The API context isn't setted up.")),
  callPublic: () => () =>
    TE.left(new Error("The API context isn't setted up.")),
});

export function ApiContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const { setError } = useContext(ErrorContext);
  const { user, refresh } = useContext(AuthContext);

  const call = <T, U>(
    task: (params: U & { token: string | Token }) => TE.TaskEither<Error, T>
  ) => (input: U) =>
    pipe(
      O.fromNullable(user),
      O.fold(
        () => {
          neededLogin(setError);
          return TE.left(new Error("Login needed."));
        },
        (user) => {
          refresh();
          return task({ ...input, ...{ token: user.token.access_token } });
        }
      ),
      logErrorIfAny
    );

  const callPublic = <T, U>(task: (params: U) => TE.TaskEither<Error, T>) => (
    input: U
  ) => pipe(input, task, logErrorIfAny);

  return (
    <ApiContext.Provider
      value={{
        call: call,
        callPublic: callPublic,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
