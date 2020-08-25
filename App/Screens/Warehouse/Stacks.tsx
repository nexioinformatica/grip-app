import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Appbar } from "../../components";
import { NewMovement } from "./NewMovement";
import { Movements } from "./Movements";

export type WarehouseStackParamList = {
  Movements: undefined;
};

export const WarehouseStack = () => {
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
  NewMovement: undefined;
};

export const MovementsStack = () => {
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
