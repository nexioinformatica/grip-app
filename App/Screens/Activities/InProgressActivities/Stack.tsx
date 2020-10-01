import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Appbar } from "../../../components/Appbar";
import { ByOperator } from "./ByOperator";
import { ByMachine } from "./ByMachine";
import { Home } from "./Home";

export type InProgressActivitiesParamList = {
  Home: undefined;
  ListByOperator: undefined;
  ListByMachine: undefined;
};

export const InProgressActivitiesStack = (): React.ReactElement => {
  const Stack = createStackNavigator<InProgressActivitiesParamList>();

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
        options={{ headerTitle: "Vedi Attività" }}
      />

      <Stack.Screen
        name="ListByOperator"
        component={ByOperator}
        options={{ headerTitle: "Attività Operatore" }}
      />

      <Stack.Screen
        name="ListByMachine"
        component={ByMachine}
        options={{ headerTitle: "Attività Macchina" }}
      />
    </Stack.Navigator>
  );
};
