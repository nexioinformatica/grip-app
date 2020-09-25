import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Appbar } from "../../../components/Appbar";
import { NewMovement } from "./NewMovement";
import { Home } from "./Home";
import { ReasonType, ReasonTypeKey } from "../../../types/ReasonType";

export type MovementStackParamList = {
  Home: undefined;
  NewMovement: { defaultReasonType: ReasonType };
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
        initialParams={{ defaultReasonType: ReasonTypeKey.UnloadProd }}
        options={{ headerTitle: "Nuovo Movimento" }}
      />
    </Stack.Navigator>
  );
};
