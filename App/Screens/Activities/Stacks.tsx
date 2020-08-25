import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Appbar } from "../../components";
import { Activities as ActivitiesScreen } from "./Activities";
import { StartActivity } from "./StartActivity";
import { Activities } from "geom-api-ts-client";
export type ActivitiesStackParamList = {
  Activities: undefined;
  StartActivity: { actionType: Activities.ActionType };
};

export const ActivitiesStack = () => {
  const Stack = createStackNavigator<ActivitiesStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Activities"
      headerMode="screen"
      screenOptions={{
        header: Appbar,
      }}
    >
      <Stack.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{ headerTitle: "Attività" }}
      />
      <Stack.Screen
        name="StartActivity"
        component={StartActivity}
        options={{ headerTitle: "Inizia Attività" }}
      />
    </Stack.Navigator>
  );
};
