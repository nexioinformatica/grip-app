import React, { useContext } from "react";
import { Text } from "react-native";

import { AuthContext, ErrorContext, PreferencesContext } from "../stores";
import { LoginNavigator, RootNavigator } from "./Navigators";
import { Splash as SpashScreen } from "./Spash";

const Screens = (): React.ReactElement => {
  const { error } = useContext(ErrorContext);
  const auth = useContext(AuthContext);
  const preferences = useContext(PreferencesContext);

  const user = auth.user;

  if (!auth.isReady || !preferences.isReady) return <SpashScreen />;

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
