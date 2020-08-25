import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import { HomeStack, ProfileStack } from "./Stacks";
import { DrawerContent } from "../components/Drawer";
import { Login } from "./Auth";
import { MovementsStack } from "./Warehouse";
import { Scan } from "./Scan";
import { ActivitiesStack } from "./Activities";
import { BarcodeEvent } from "../types";

export type RootNavigatorParamList = {
  Home: undefined;
  Profile: undefined;
  Movements: undefined;
  Activities: undefined;
  Scan: { onBarcodeScanned?: (barcode: BarcodeEvent) => void };
};

export const RootNavigator = (): React.ReactElement => {
  const Drawer = createDrawerNavigator<RootNavigatorParamList>();

  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="Profile" component={ProfileStack} />
        <Drawer.Screen name="Movements" component={MovementsStack} />
        <Drawer.Screen name="Activities" component={ActivitiesStack} />
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
