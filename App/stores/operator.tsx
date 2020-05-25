import React, { createContext, useState, useContext } from "react";

import moment from "moment";

import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";

import { noop } from "../util/noop";
import { ErrorContext } from "./error";
import { Login, Token, User } from "../types";
import { token as tokenApi } from "../data/auth";
import { Operator } from "../types/Api";

interface Context {
  operator?: Operator;
  setOperator: (operator: Operator) => void;
}

export const OperatorContext = createContext<Context>({
  operator: undefined,
  setOperator: noop,
});

export function OperatorContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const [operator, setOperator] = useState<undefined | Operator>(undefined);

  return (
    <OperatorContext.Provider
      value={{ operator: operator, setOperator: setOperator }}
    >
      {children}
    </OperatorContext.Provider>
  );
}
