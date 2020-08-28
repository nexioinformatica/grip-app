import React from "react";
import { TouchableOpacity } from "react-native";
import {
  Appbar as AppbarPaper,
  IconButton,
  useTheme,
} from "react-native-paper";

import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackHeaderProps } from "@react-navigation/stack";

type Props = StackHeaderProps;

export const Appbar = ({
  scene,
  previous,
  navigation,
}: Props): React.ReactElement => {
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
            ((navigation as unknown) as DrawerNavigationProp<
              Record<string, Record<string, unknown> | undefined>
            >).openDrawer();
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
