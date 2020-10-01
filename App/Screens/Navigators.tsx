import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import { DrawerContent } from "../components/Drawer";
import { BarcodeEvent } from "../types";
import { Activity } from "./Activities";
import { Login } from "./Auth";
import { Scan } from "./Scan";
import { HomeStack, ProfileStack } from "./Stacks";
import { Warehouse } from "./Warehouse";

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
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        initialRouteName="Home"
      >
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="Profile" component={ProfileStack} />
        <Drawer.Screen name="Warehouse" component={Warehouse} />
        <Drawer.Screen name="Activity" component={Activity} />
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
