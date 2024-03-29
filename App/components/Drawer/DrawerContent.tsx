import React, { useContext, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  Avatar,
  Caption,
  Drawer,
  List,
  Paragraph,
  Surface,
  Switch,
  Text,
  Title,
  TouchableRipple,
} from "react-native-paper";

import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";
import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { AuthContext, ApiContext, PreferencesContext } from "../../stores";
import { pipe } from "fp-ts/lib/pipeable";
import { Operator } from "geom-api-ts-client";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { getInitials } from "../../types";

type Props = DrawerContentComponentProps<DrawerContentOptions>;

const AvatarPlaceholder = () => (
  <Placeholder Animation={Fade}>
    <PlaceholderMedia />
  </Placeholder>
);

const SingleLinePlaceholder = () => (
  <Placeholder Animation={Fade}>
    <PlaceholderLine />
  </Placeholder>
);

const DrawerContent = (props: Props): React.ReactElement => {
  const { call } = useContext(ApiContext);
  const { user } = useContext(AuthContext);
  const preferences = useContext(PreferencesContext);
  const makeCancellable = useCancellablePromise();
  const [realName, setRealName] = useState<string | undefined>(undefined);

  if (!user) throw new Error("User is undefined. ");

  const getMe = () =>
    pipe(
      pipe(call(Operator.getMe)({ settings: makeSettings() }), toResultTask)(),
      makeCancellable
    )
      .then((x) => setRealName(x.Nome))
      .catch();

  useEffect(() => {
    getMe();
  }, []);

  const avatar = realName ? (
    <Avatar.Text label={getInitials(realName)} size={50} />
  ) : (
    <AvatarPlaceholder />
  );

  const userName = realName ? (
    <Title style={styles.title}>{realName}</Title>
  ) : (
    <SingleLinePlaceholder />
  );

  return (
    <Surface style={styles.drawerContent}>
      <DrawerContentScrollView {...props}>
        <Surface style={styles.userInfoSection}>
          {avatar}

          <Surface
            style={{
              marginTop: 20,
            }}
          >
            {userName}
          </Surface>

          <Caption style={styles.caption}>@{user.username}</Caption>
        </Surface>
        <Drawer.Section style={styles.drawerSection} focusable={false}>
          <List.Item
            title="Dashboard"
            left={(props) => <List.Icon {...props} icon="palette" />}
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          />
          <List.Item
            title="Attività"
            left={(props) => <List.Icon {...props} icon="animation-play" />}
            onPress={() => {
              props.navigation.navigate("Activity");
            }}
          />
          <List.Item
            title="Magazzino"
            left={(props) => <List.Icon {...props} icon="warehouse" />}
            onPress={() => {
              props.navigation.navigate("Warehouse");
            }}
          />
        </Drawer.Section>
        <Drawer.Section title="Impostazioni" focusable={false}>
          <List.Item
            left={(props) => <List.Icon {...props} icon="account-outline" />}
            title="Profilo"
            onPress={() => {
              props.navigation.navigate("Profile");
            }}
          />
          <List.Item
            left={(props) => (
              <List.Icon {...props} icon="information-outline" />
            )}
            title="Info"
            onPress={() => {
              props.navigation.navigate("Info");
            }}
          />
        </Drawer.Section>
        <Drawer.Section title="Prefrenze" focusable={false}>
          <TouchableRipple onPress={preferences.theme.toggle}>
            <Surface style={styles.preference}>
              <Text>Tema scuro</Text>
              <Surface pointerEvents="none">
                <Switch value={preferences.theme.current === "dark"} />
              </Surface>
            </Surface>
          </TouchableRipple>
        </Drawer.Section>
      </DrawerContentScrollView>
    </Surface>
  );
};

const DrawerContentMemo = React.memo(DrawerContent);

export { DrawerContentMemo as DrawerContent };

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
