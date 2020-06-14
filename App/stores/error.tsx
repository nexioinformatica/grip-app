import React, { createContext, useState } from "react";

import { noop } from "../util/noop";

interface Context {
  error?: Error;
  setError: (error?: Error) => void;
}

export const ErrorContext = createContext<Context>({
  error: undefined,
  setError: noop,
});

export function ErrorContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const [error, setError] = useState<Error | undefined>(undefined);

  return (
    <ErrorContext.Provider
      value={{
        error: error,
        setError: setError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}
