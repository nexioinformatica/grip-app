import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Avatar, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Home } from "./Home";
import { Appbar } from "../components/AppBar";

// import { BottomTabs } from './bottomTabs';
// import { Details } from './details';
// import { StackNavigatorParamlist } from './types';

export type StackNavigatorParamlist = {
  Home: undefined;
  Example: undefined;
  Details: {
    id: number;
    name: string;
    handle: string;
    date: string;
    content: string;
    image: string;
    avatar: string;
    comments: number;
    retweets: number;
    hearts: number;
  };
};

export const StackNavigator = () => {
  const Stack = createStackNavigator<StackNavigatorParamlist>();

  const theme = useTheme();

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
        // options={({ route }) => {
        //   console.log("!@# options", { route });
        //   const routeName = route.state
        //     ? route.state.routes[route.state.index].name
        //     : "Feed";
        //   return { headerTitle: routeName };
        // }}
        options={{ headerTitle: "Tweet" }}
      />
      <Stack.Screen
        name="Example"
        component={Home}
        options={{ headerTitle: "Tweet" }}
      />
    </Stack.Navigator>
  );
};
