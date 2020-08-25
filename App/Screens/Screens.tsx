import React, { useContext } from "react";
import { Text } from "react-native";

import { AuthContext, ErrorContext } from "../stores";
import { LoginNavigator, RootNavigator } from "./Navigators";

const Screens = (): React.ReactElement => {
  const { error } = useContext(ErrorContext);
  const { user } = useContext(AuthContext);

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
