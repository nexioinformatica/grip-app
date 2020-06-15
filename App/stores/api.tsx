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
  ReasonTypeKey,
  BarcodeDecode,
} from "../types/Api";
import { noop } from "../util/noop";
import {
  getOperators,
  // getReasons,
  postMovement,
  postBarcodeDecode,
} from "../data/api";
import { req, neededLogin, errorOccurred } from "../util/api";
import { Entry, Data, Entries } from "../types/Util";

interface Context {
  api: {
    operators: (
      isApiEnabled: boolean,
      isDepartmentEnabled: boolean
    ) => TE.TaskEither<Error, Operators>;
    // movementReasons: () => T.Task<Reasons>;
    newMovement: (movement: NewMovement) => TE.TaskEither<Error, Movement>;
    reasonTypes: () => T.Task<ReasonType[]>;
    barcodeDecode: (barcode: string) => TE.TaskEither<Error, BarcodeDecode[]>;
  };
}

export interface OperatorsParam {
  // TODO: move away
  isApiEnabled: boolean;
  isDepartmentEnabled: boolean;
}

export const ApiContext = createContext<Context>({
  api: {
    operators: (params: OperatorsParam) => T.never,
    // movementReasons: () => T.of([]),
    newMovement: (movement: NewMovement) => T.never,
    reasonTypes: () => T.never,
    barcodeDecode: (barcode: string) => T.never,
  },
});

export function ApiContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const { setError } = useContext(ErrorContext);
  const { user } = useContext(AuthContext);

  const operators = ({
    isApiEnabled,
    isDepartmentEnabled,
  }: OperatorsParam): TE.TaskEither<Error, Operators> =>
    pipe(
      O.fromNullable(user?.token),
      O.fold(
        () => neededLogin<Operators>(setError),
        (token) =>
          pipe(
            pipe(token, req, getOperators)(isApiEnabled, isDepartmentEnabled),
            TE.fold(
              (err) => TE.left(err),
              (res) => TE.right(res.data)
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

  const reasonTypes = (): T.Task<ReasonType[]> =>
    T.of([
      { key: ReasonTypeKey.Specified, label: "Specificato" },
      { key: ReasonTypeKey.LoadProd, label: "Carico per produzione" },
      { key: ReasonTypeKey.UnloadProd, label: "Scarico da produzione" },
      { key: ReasonTypeKey.LoadRemnant, label: "Carico avanzo" },
      { key: ReasonTypeKey.LoadScrap, label: "Carico scarto" },
    ]);

  const newMovement = (movement: NewMovement): TE.TaskEither<Error, Movement> =>
    pipe(
      O.fromNullable(user?.token),
      O.fold(
        () => neededLogin(setError),
        (token) =>
          pipe(
            pipe(token, req, postMovement)(movement),
            TE.fold(
              (err) => TE.left(err),
              (res) => TE.right(res.data)
            )
          )
      )
    );

  const barcodeDecode = (
    barcode: string
  ): TE.TaskEither<Error, BarcodeDecode[]> =>
    pipe(
      O.fromNullable(user?.token),
      O.fold(
        () => neededLogin(setError),
        (token) =>
          pipe(
            pipe(token, req, postBarcodeDecode)(barcode),
            TE.fold(
              (err) => TE.left(err),
              (res) => TE.right(res.data)
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
          barcodeDecode: barcodeDecode,
        },
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
