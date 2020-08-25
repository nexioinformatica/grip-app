import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./Home";
import { Appbar } from "../components/AppBar";
import { Profile } from "./Auth";
import { Scan } from "./Scan";
import { BarcodeEvent } from "../types";

export type HomeStackParamList = {
  Home: undefined;
  Scan: { onBarcodeScanned?: (barcode: BarcodeEvent) => void };
};

export const HomeStack = (): React.ReactElement => {
  const Stack = createStackNavigator<HomeStackParamList>();

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
        options={{ headerTitle: "Dashboard" }}
      />
      <Stack.Screen
        name="Scan"
        component={Scan}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export const ProfileStack = (): React.ReactElement => {
  const Stack = createStackNavigator<ProfileStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Profile"
      headerMode="screen"
      screenOptions={{
        header: Appbar,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerTitle: "Profilo" }}
      />
    </Stack.Navigator>
  );
};
