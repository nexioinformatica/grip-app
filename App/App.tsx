import React from "react";

import { Screens } from "./Screens";
import {
  ApiContextProvider,
  AuthContextProvider,
  ErrorContextProvider,
  PaperContextProvider,
  PreferencesContextProvider,
} from "./stores";
import { IS_SENTRY_SET_UP } from "./util/constants";
import { init as sentryInit } from "./util/sentry";

if (IS_SENTRY_SET_UP) {
  sentryInit();
}

const App = (): React.ReactElement => {
  return (
    <ErrorContextProvider>
      <PreferencesContextProvider>
        <AuthContextProvider>
          <ApiContextProvider>
            <PaperContextProvider>
              <Screens />
            </PaperContextProvider>
          </ApiContextProvider>
        </AuthContextProvider>
      </PreferencesContextProvider>
    </ErrorContextProvider>
  );
};

export { App };
