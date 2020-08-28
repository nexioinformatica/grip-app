import React, { useContext } from "react";
import { Text } from "react-native";

import { AuthContext, ErrorContext } from "../stores";
import { LoginNavigator, RootNavigator } from "./Navigators";
import { Splash as SpashScreen } from "./Spash";

const Screens = (): React.ReactElement => {
  const { error } = useContext(ErrorContext);
  const { user, isReady } = useContext(AuthContext);

  if (!isReady) return <SpashScreen />;

  if (!user) return <LoginNavigator />;

  // TODO: replace this with an ErrorNavigator
  if (error)
    return (
      <Text>
        There was an error :( {error.message} {error.stack}
      </Text>
    );

  return <RootNavigator />;
};

export { Screens };
