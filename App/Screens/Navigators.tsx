import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import { StackNavigator } from "./Stacks";
import { Home } from "./Home";
import { DrawerContent } from "../components/Drawer";
import { Login } from "./Auth";

export const RootNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={StackNavigator} />
        {/* <Drawer.Screen name="Home" component={Home} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export const LoginNavigator = () => {
  const Stack = createDrawerNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
