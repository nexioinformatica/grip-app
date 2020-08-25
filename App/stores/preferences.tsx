import React, { createContext, useState } from "react";

import { noop } from "../util/noop";

interface Context {
  theme: { current: "dark" | "light"; toggle: () => void };
}

export const PreferencesContext = createContext<Context>({
  theme: { current: "light", toggle: noop },
});

export function PreferencesContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light");

  const toggleTheme = () =>
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");

  return (
    <PreferencesContext.Provider
      value={{
        theme: { current: currentTheme, toggle: toggleTheme },
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
