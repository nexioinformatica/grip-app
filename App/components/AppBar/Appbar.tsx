import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Appbar as AppbarPaper,
  Avatar,
  useTheme,
  IconButton,
} from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackHeaderProps } from "@react-navigation/stack";

type Props = StackHeaderProps;

export const Appbar = ({ scene, previous, navigation }: Props) => {
  const theme = useTheme();

  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  return (
    <AppbarPaper.Header theme={{ colors: { primary: theme.colors.surface } }}>
      {previous ? (
        <AppbarPaper.BackAction
          onPress={navigation.goBack}
          color={theme.colors.primary}
        />
      ) : (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            ((navigation as any) as DrawerNavigationProp<{}>).openDrawer();
          }}
        >
          <IconButton icon="menu" />
        </TouchableOpacity>
      )}
      <AppbarPaper.Content
        title={title}
        titleStyle={{
          fontSize: 18,
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      />
    </AppbarPaper.Header>
  );
};
