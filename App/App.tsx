import React, { useEffect, useState } from "react";
import { Text } from "native-base";
import * as Font from "expo-font";
import { ThemeProvider } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Splash as SplashScreen } from "./Screens/Splash";
import { Screens } from "./Screens";
import { theme } from "./util/theme";
import { ErrorContextProvider, AuthContextProvider } from "./stores";

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

  return (
    <ErrorContextProvider>
      <ThemeProvider theme={theme}>
        <AuthContextProvider>
          {isFontReady && isReady ? <Screens /> : <SplashScreen />}
        </AuthContextProvider>
      </ThemeProvider>
    </ErrorContextProvider>
  );
};

export { App };
