import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./Home";
import { Appbar } from "../components/AppBar";
import { Profile } from "./Auth";

export type HomeStackParamList = {
  Home: undefined;
  Profile: undefined;
  Scan: undefined;
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
