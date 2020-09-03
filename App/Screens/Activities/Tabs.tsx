import React from "react";
import { useTheme } from "react-native-paper";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { getIcon } from "../../util/ui";
import { ByMachine, ByOperator } from "./ActivityCollection";
import { StartActivity } from "./StartActivity";
import { StopActivity } from "./StopActivity";

export type ActivityTabNavigator = {
  ListByOperator: undefined;
  ListByMachine: undefined;
  StartActivity: undefined;
  StopActivity: undefined;
};

export const ActivityTab = (): React.ReactElement => {
  const theme = useTheme();
  const Tab = createBottomTabNavigator<ActivityTabNavigator>();
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        inactiveTintColor: "gray",
        style: {
          backgroundColor: theme.colors.surface,
        },
      }}
    >
      <Tab.Screen
        name="ListByOperator"
        component={ByOperator}
        options={{
          tabBarLabel: "Operatore",
          tabBarIcon: getIcon("format-list-bulleted"),
        }}
      />
      <Tab.Screen
        name="ListByMachine"
        component={ByMachine}
        options={{
          tabBarLabel: "Macchina",
          tabBarIcon: getIcon("format-list-bulleted"),
        }}
      />
      <Tab.Screen
        name="StartActivity"
        component={StartActivity}
        options={{
          tabBarLabel: "Start",
          tabBarIcon: getIcon("play"),
        }}
      />
      <Tab.Screen
        name="StopActivity"
        component={StopActivity}
        options={{
          tabBarLabel: "Stop",
          tabBarIcon: getIcon("stop"),
        }}
      />
    </Tab.Navigator>
  );
};
