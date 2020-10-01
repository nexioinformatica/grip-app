import React from "react";

import { BackgroundCenter, Header, Logo } from "../../components/Auth";
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
