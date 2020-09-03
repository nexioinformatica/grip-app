import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import { HomeStack, ProfileStack } from "./Stacks";
import { DrawerContent } from "../components/Drawer";
import { Login } from "./Auth";
import { WarehouseStack } from "./Warehouse";
import { Scan } from "./Scan";
import { ActivitiyStack } from "./Activities";
import { BarcodeEvent } from "../types";

export type RootNavigatorParamList = {
  Home: undefined;
  Profile: undefined;
  Warehouse: undefined;
  Activity: undefined;
  Scan: { onBarcodeScanned?: (barcode: BarcodeEvent) => void };
};

export const RootNavigator = (): React.ReactElement => {
  const Drawer = createDrawerNavigator<RootNavigatorParamList>();

  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="Profile" component={ProfileStack} />
        <Drawer.Screen name="Warehouse" component={WarehouseStack} />
        <Drawer.Screen name="Activity" component={ActivitiyStack} />
        <Drawer.Screen name="Scan" component={Scan} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export type LoginNavigatorParamList = {
  Login: undefined;
};

export const LoginNavigator = (): React.ReactElement => {
  const Stack = createDrawerNavigator<LoginNavigatorParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
