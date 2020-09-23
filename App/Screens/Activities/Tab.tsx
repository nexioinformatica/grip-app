import React from "react";
import { useTheme } from "react-native-paper";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { getIcon } from "../../util/ui";
import { InProgressActivitiesStack } from "./InProgressActivities";
import { ManageActivityStatusStack } from "./ManageActivityStatus";

export type ActivityTabNavigator = {
  InProgressActivities: undefined;
  ManageActivityStatus: undefined;
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
        name="InProgressActivities"
        component={InProgressActivitiesStack}
        options={{
          tabBarLabel: "Lista",
          tabBarIcon: getIcon("format-list-bulleted"),
        }}
      />
      <Tab.Screen
        name="ManageActivityStatus"
        component={ManageActivityStatusStack}
        options={{
          tabBarLabel: "Gestisci",
          tabBarIcon: getIcon("play-pause"),
        }}
      />
    </Tab.Navigator>
  );
};
