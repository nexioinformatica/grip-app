import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Appbar } from "../../components/Appbar";
import { ReasonType } from "../../types/ReasonType";
import { Movements } from "./Movements";
import { NewMovement } from "./NewMovement";

export type WarehouseStackParamList = {
  Movements: undefined;
};

export const WarehouseStack = (): React.ReactElement => {
  const Stack = createStackNavigator<WarehouseStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Movements"
      headerMode="screen"
      screenOptions={{
        header: Appbar,
      }}
    >
      <Stack.Screen
        name="Movements"
        component={Movements}
        options={{ headerTitle: "Movimenti" }}
      />
    </Stack.Navigator>
  );
};

export type MovementsStackParamList = {
  Movements: undefined;
  NewMovement: { reasonType: ReasonType };
};

export const MovementsStack = (): React.ReactElement => {
  const Stack = createStackNavigator<MovementsStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Movements"
      headerMode="screen"
      screenOptions={{
        header: Appbar,
      }}
    >
      <Stack.Screen
        name="Movements"
        component={Movements}
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
