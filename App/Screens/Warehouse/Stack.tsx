import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Appbar } from "../../components/Appbar";
import { Warehouse } from "./Warehouse";

export type WarehouseStackParamList = {
  Warehouse: undefined;
};

export const WarehouseStack = (): React.ReactElement => {
  const Stack = createStackNavigator<WarehouseStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Warehouse"
      headerMode="screen"
      screenOptions={{
        header: Appbar,
      }}
    >
      <Stack.Screen
        name="Warehouse"
        component={Warehouse}
        options={{ headerTitle: "Magazzino" }}
      />
    </Stack.Navigator>
  );
};
