import React from "react";
import { Provider as PaperProvider } from "react-native-paper";

import { Screens } from "./Screens";
import {
  ApiContextProvider,
  AuthContextProvider,
  ErrorContextProvider,
  PreferencesContextProvider,
  PreferencesContext,
} from "./stores";
import { IS_SENTRY_SET_UP } from "./util/constants";
import { init as sentryInit } from "./util/sentry";
import { theme, lightTheme, darkTheme } from "./util/theme";
import { useColorScheme } from "react-native";

if (IS_SENTRY_SET_UP) {
  sentryInit();
}

const App = (): React.ReactElement => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<"light" | "dark">(
    colorScheme === "dark" ? "dark" : "light"
  );
  function toggleTheme() {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }

  const preferences = React.useMemo(
    () => ({
      theme: { toggle: toggleTheme, current: theme },
    }),
    [theme]
  );

  return (
    <ErrorContextProvider>
      <PreferencesContext.Provider value={preferences}>
        <AuthContextProvider>
          <ApiContextProvider>
            <PaperProvider theme={theme === "light" ? lightTheme : darkTheme}>
              <Screens />
            </PaperProvider>
          </ApiContextProvider>
        </AuthContextProvider>
      </PreferencesContext.Provider>
    </ErrorContextProvider>
  );
};

export { App };
