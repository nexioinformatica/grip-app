import React, { createContext, useState } from "react";

import { noop } from "../util/noop";
import { Operator } from "../types/Api";

// TODO: this module may be removed (check).

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
