import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import { HomeStack, ProfileStack } from "./Stacks";
import { Home } from "./Home";
import { DrawerContent } from "../components/Drawer";
import { Login } from "./Auth";
import { MovementsStack } from "./Warehouse";
import { Scan } from "./Scan";

export type RootNavigatorParamList = {
  Home: undefined;
  Profile: undefined;
  Movements: undefined;
  Scan: undefined;
};

export const RootNavigator = () => {
  const Drawer = createDrawerNavigator<RootNavigatorParamList>();

  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="Profile" component={ProfileStack} />
        <Drawer.Screen name="Movements" component={MovementsStack} />
        <Drawer.Screen name="Scan" component={Scan} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export type LoginNavigatorParamList = {
  Login: undefined;
};

export const LoginNavigator = () => {
  const Stack = createDrawerNavigator<LoginNavigatorParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
