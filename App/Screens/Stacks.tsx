import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Avatar, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Home } from "./Home";
import { Appbar } from "../components/AppBar";
import { Profile } from "./Auth";
import {
  WarehouseStack,
  NewMovement,
  Movements,
  MovementsStack,
} from "./Warehouse";

export type HomeStackParamList = {
  Home: undefined;
  Example: undefined;
  Profile: undefined;
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

export const HomeStack = () => {
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

export const ProfileStack = () => {
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
