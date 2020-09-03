import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Appbar } from "../../components/Appbar";
import { Activity } from "./Activity";

export type ActivitiesStackParamList = {
  Activity: undefined;
};

export const ActivitiyStack = (): React.ReactElement => {
  const Stack = createStackNavigator<ActivitiesStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Activity"
      headerMode="screen"
      screenOptions={{
        header: Appbar,
      }}
    >
      <Stack.Screen
        name="Activity"
        component={Activity}
        options={{ headerTitle: "Attività" }}
      />
    </Stack.Navigator>
  );
};
