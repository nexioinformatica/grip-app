import React from "react";
import { useTheme } from "react-native-paper";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getIcon } from "../../util/ui";
import { MovementStack } from "./Movement/Stack";

export type WarehouseTabNavigator = {
  Movement: undefined;
};

export const WarehouseTab = (): React.ReactElement => {
  const theme = useTheme();
  const Tab = createBottomTabNavigator<WarehouseTabNavigator>();
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
        name="Movement"
        component={MovementStack}
        options={{
          tabBarLabel: "Movimenti",
          tabBarIcon: getIcon("format-list-checks"),
        }}
      />
    </Tab.Navigator>
  );
};
