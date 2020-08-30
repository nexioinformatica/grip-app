import React, { createContext, useState, useEffect } from "react";

import { noop } from "../util/noop";
import { AsyncStorage } from "react-native";
import { getItemOrDefault, notNullParser } from "../util/storage";
import { sentryError } from "../util/sentry";
import { pipe } from "fp-ts/lib/pipeable";

export type ThemeType = "dark" | "light";

interface Context {
  theme: { current: ThemeType; toggle: () => void };
  isReady: boolean;
}

export const PreferencesContext = createContext<Context>({
  theme: { current: "light", toggle: noop },
  isReady: false,
});

export function PreferencesContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const [isReady, setReady] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("light");

  // fetch saved preferences
  useEffect(() => {
    (async () => {
      const currentTheme = await AsyncStorage.getItem("theme.current");

      setCurrentTheme(pipe(currentTheme, getThemeOrDefault("light")));
    })()
      .then(() => setReady(true))
      .catch(fireSentryError);
  }, []);

  // update preferences
  useEffect(() => {
    AsyncStorage.setItem("theme.current", currentTheme).catch(fireSentryError);
  }, [currentTheme]);

  const toggleTheme = () =>
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");

  return (
    <PreferencesContext.Provider
      value={{
        theme: { current: currentTheme, toggle: toggleTheme },
        isReady: isReady,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

const getThemeOrDefault = getItemOrDefault<ThemeType, string>(notNullParser)(
  (x) => x === "light" || x === "dark"
);

const fireSentryError = (reason: any) => {
  sentryError("PreferencesContext")(
    reason instanceof Error ? reason : new Error(reason as string)
  );
};
