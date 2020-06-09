import React, { createContext, useState, useContext } from "react";

import moment from "moment";

import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";

import { ErrorContext } from "./error";
import { AuthContext } from "./auth";
import {
  Operators,
  // Reasons,
  NewMovement,
  Movement,
  ReasonTypes,
  ReasonType,
} from "../types/Api";
import { noop } from "../util/noop";
import {
  getOperators,
  // getReasons,
  postMovement,
} from "../data/api";
import { req, neededLogin, errorOccurred } from "../util/api";
import { Entry, Data, Entries } from "../types/Util";

interface Context {
  api: {
    operators: (
      isApiEnabled: boolean,
      isDepartmentEnabled: boolean
    ) => T.Task<Operators>;
    // movementReasons: () => T.Task<Reasons>;
    newMovement: (movement: NewMovement) => T.Task<O.Option<Movement>>;
    reasonTypes: () => T.Task<Entries<ReasonType, string>>;
  };
}

export const ApiContext = createContext<Context>({
  api: {
    operators: (isApiEnabled: boolean, isDepartmentEnabled: boolean) =>
      T.of([]),
    // movementReasons: () => T.of([]),
    newMovement: (movement: NewMovement) => T.of(O.none),
    reasonTypes: () => T.of([]),
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

  // const movementReasons = () =>
  //   pipe(
  //     O.fromNullable(user?.token),
  //     O.fold(
  //       () => neededLogin(setError, []),
  //       (token) =>
  //         pipe(
  //           pipe(token, req, getReasons)(),
  //           TE.fold(
  //             (err) => errorOccurred(setError, err, []),
  //             (res) => T.of(res.data)
  //           )
  //         )
  //     )
  //   );

  // TODO: change the any type
  const reasonTypes = (): T.Task<Entries<ReasonType, string>> =>
    T.of([
      { key: ReasonType.Specified, value: "Specificato" },
      { key: ReasonType.LoadProd, value: "Carico per produzione" },
      { key: ReasonType.UnloadProd, value: "Scarico da produzione" },
      { key: ReasonType.LoadRemnant, value: "Carico avanzo" },
      { key: ReasonType.LoadScrap, value: "Carico scarto" },
    ]);

  const newMovement = (movement: NewMovement): T.Task<O.Option<Movement>> =>
    pipe(
      O.fromNullable(user?.token),
      O.fold(
        () => neededLogin(setError, O.none),
        (token) =>
          pipe(
            pipe(token, req, postMovement)(movement),
            TE.fold(
              (err) => errorOccurred(setError, err, O.none),
              (res) => T.of(O.some(res.data))
            )
          )
      )
    );

  return (
    <ApiContext.Provider
      value={{
        api: {
          operators: operators,
          // movementReasons: movementReasons,
          newMovement: newMovement,
          reasonTypes: reasonTypes,
        },
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
