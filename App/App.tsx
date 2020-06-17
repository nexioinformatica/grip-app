import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Font from "expo-font";
import { ThemeProvider } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Splash as SplashScreen } from "./Screens/Splash";
import { Screens } from "./Screens";
import { theme } from "./util/theme";
import { ErrorContextProvider, AuthContextProvider } from "./stores";
import { ApiContextProvider } from "./stores/api";
import { OperatorContextProvider } from "./stores/operator";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import { IS_SENTRY_SET_UP, RELEASE_CHANNEL } from "./util/constants";
import { sentryError } from "./util/sentry";

// Add Sentry if available
if (IS_SENTRY_SET_UP) {
  Sentry.init({
    dsn: Constants.manifest.extra.sentryPublicDsn,
    enableInExpoDevelopment: true,
    debug: true,
  });

  Sentry.setRelease(RELEASE_CHANNEL);
  if (Constants.manifest.revisionId) {
    Sentry.setExtra("sisRevisionId", Constants.manifest.revisionId);
  }
}

const App = () => {
  const [isFontReady, setFontReady] = useState(false);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    (async function () {
      await Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        ...Ionicons.font,
      });
      setFontReady(true);
    })();
  }, [setFontReady]);

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 0);
  }, [setReady]);

  useEffect(() => {
    sentryError("App")(new Error("Test 1"));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ErrorContextProvider>
        <AuthContextProvider>
          <ApiContextProvider>
            <OperatorContextProvider>
              {isFontReady && isReady ? <Screens /> : <SplashScreen />}
            </OperatorContextProvider>
          </ApiContextProvider>
        </AuthContextProvider>
      </ErrorContextProvider>
    </ThemeProvider>
  );
};

export { App };
