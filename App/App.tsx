import React from "react";
import { Provider as PaperProvider } from "react-native-paper";

import { Screens } from "./Screens";
import {
  ApiContextProvider,
  AuthContextProvider,
  ErrorContextProvider,
} from "./stores";
import { IS_SENTRY_SET_UP } from "./util/constants";
import { init as sentryInit } from "./util/sentry";
import { theme } from "./util/theme";

if (IS_SENTRY_SET_UP) {
  sentryInit();
}

const App = (): React.ReactElement => {
  return (
    <ErrorContextProvider>
      <AuthContextProvider>
        <ApiContextProvider>
          <PaperProvider theme={theme}>
            <Screens />
          </PaperProvider>
        </ApiContextProvider>
      </AuthContextProvider>
    </ErrorContextProvider>
  );
};

export { App };
