import React, { createContext, useContext } from "react";

import { pipe } from "fp-ts/lib/pipeable";
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
  ReasonType,
  ReasonTypeKey,
  BarcodeDecode,
  ActionType,
  ActionTypeKey,
  StartProcessing,
} from "../types/Api";
import {
  getOperators,
  // getReasons,
  postMovement,
  postBarcodeDecode,
  putStartProcessing,
} from "../data/api";
import { req, neededLogin, publicReq } from "../util/api";

interface Context {
  api: {
    operators: (params: OperatorsParam) => TE.TaskEither<Error, Operators>;
    // movementReasons: () => T.Task<Reasons>;
    newMovement: (movement: NewMovement) => TE.TaskEither<Error, Movement>;
    reasonTypes: () => T.Task<ReasonType[]>;
    barcodeDecode: (barcode: string) => TE.TaskEither<Error, BarcodeDecode[]>;
    actionTypes: () => T.Task<ActionType[]>;
    startProcessing: (
      data: StartProcessing
    ) => TE.TaskEither<Error, StartProcessing>;
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
    actionTypes: () => T.never,
    startProcessing: (data: StartProcessing) => T.never,
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
      pipe(publicReq(), getOperators)(isApiEnabled, isDepartmentEnabled),
      TE.fold(
        (err) => TE.left(err),
        (res) => TE.right(res.data)
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

  const actionTypes = (): T.Task<ActionType[]> =>
    T.of([
      { key: ActionTypeKey.MachineAndOperator, label: "Macchina e Operatore" },
      { key: ActionTypeKey.Machine, label: "Macchina" },
      { key: ActionTypeKey.Operator, label: "Operatore" },
    ]);

  const startProcessing = (
    data: StartProcessing
  ): TE.TaskEither<Error, StartProcessing> =>
    pipe(
      O.fromNullable(user?.token),
      O.fold(
        () => neededLogin(setError),
        (token) =>
          pipe(
            pipe(token, req, putStartProcessing)(data),
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
          actionTypes: actionTypes,
          startProcessing: startProcessing,
        },
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
