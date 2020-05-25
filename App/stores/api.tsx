import React, { createContext, useState, useContext } from "react";

import moment from "moment";

import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";

import { ErrorContext } from "./error";
import { AuthContext } from "./auth";
import { Operators } from "../types/Api";
import { noop } from "../util/noop";
import { getOperators } from "../data/api";
import { req, neededLogin, errorOccurred } from "../util/api";

interface Context {
  api: {
    operators: (
      isApiEnabled: boolean,
      isDepartmentEnabled: boolean
    ) => T.Task<Operators>;
  };
}

export const ApiContext = createContext<Context>({
  api: {
    operators: (isApiEnabled: boolean, isDepartmentEnabled: boolean) =>
      T.of([]),
  },
});

export function ApiContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const { setError } = useContext(ErrorContext);
  const { user } = useContext(AuthContext);

  const operators = (isApiEnabled: boolean, isDepartmentEnabled: boolean) =>
    pipe(
      O.fromNullable(user?.token),
      O.fold(
        () => neededLogin(setError, []),
        (token) =>
          pipe(
            pipe(token, req, getOperators)(isApiEnabled, isDepartmentEnabled),
            TE.fold(
              (err) => errorOccurred(setError, err, []),
              (res) => T.of(res.data)
            )
          )
      )
    );

  return (
    <ApiContext.Provider value={{ api: { operators: operators } }}>
      {children}
    </ApiContext.Provider>
  );
}
