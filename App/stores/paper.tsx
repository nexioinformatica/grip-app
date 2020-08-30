import React, { useContext } from "react";

import { Provider as PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "../util/theme";
import { PreferencesContext } from "./preferences";

export function PaperContextProvider({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement {
  const preferences = useContext(PreferencesContext);
  const isLight = preferences.theme.current === "light";
  return (
    <PaperProvider theme={isLight ? lightTheme : darkTheme}>
      {children}
    </PaperProvider>
  );
}
