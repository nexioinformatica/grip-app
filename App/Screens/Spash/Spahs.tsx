import React from "react";
import { StyleSheet } from "react-native";

import { BackgroundCenter, Header, Logo } from "../../components/Auth";
import { theme } from "../../util/theme";
import { ActivityIndicator } from "react-native-paper";

export const Splash = (): React.ReactElement => {
  return (
    <BackgroundCenter>
      <Logo />

      <Header>Grip Project</Header>

      <ActivityIndicator />
    </BackgroundCenter>
  );
};
