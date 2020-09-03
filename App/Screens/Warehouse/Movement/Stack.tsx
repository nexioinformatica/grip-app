import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Appbar } from "../../../components/Appbar";
import { NewMovement } from "./NewMovement";
import { Home } from "./Home";

export type MovementStackParamList = {
  Home: undefined;
  NewMovement: undefined;
};

export const MovementStack = (): React.ReactElement => {
  const Stack = createStackNavigator<MovementStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="screen"
      screenOptions={{
        header: Appbar,
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerTitle: "Movimenti" }}
      />
      <Stack.Screen
        name="NewMovement"
        component={NewMovement}
        options={{ headerTitle: "Nuovo Movimento" }}
      />
    </Stack.Navigator>
  );
};
