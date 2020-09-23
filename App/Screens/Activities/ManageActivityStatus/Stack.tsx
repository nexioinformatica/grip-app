import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Appbar } from "../../../components/Appbar";
import { EndActivity } from "./EndActivity";
import { StartActivity } from "./StartActivity";
import { StopActivity } from "./StopActivity";
import { Home } from "./Home";

export type ManageActivityStatusParamList = {
  Home: undefined;
  StartActivity: undefined;
  StopActivity: undefined;
  EndActivity: undefined;
};

export const ManageActivityStatusStack = (): React.ReactElement => {
  const Stack = createStackNavigator<ManageActivityStatusParamList>();

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
        options={{ headerTitle: "Gestisci Attività" }}
      />

      <Stack.Screen
        name="StartActivity"
        component={StartActivity}
        options={{ headerTitle: "Inizia Attività" }}
      />

      <Stack.Screen
        name="StopActivity"
        component={StopActivity}
        options={{ headerTitle: "Pausa Attività" }}
      />

      <Stack.Screen
        name="EndActivity"
        component={EndActivity}
        options={{ headerTitle: "Fine Attività" }}
      />
    </Stack.Navigator>
  );
};
