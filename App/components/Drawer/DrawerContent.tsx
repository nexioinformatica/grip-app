import React, { memo, useContext, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Caption,
  Drawer,
  List,
  Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
} from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";
import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { AuthContext, ApiContext } from "../../stores";
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

export const DrawerContent = memo((props: Props) => {
  const { call } = useContext(ApiContext);
  const { user } = useContext(AuthContext);
  const makeCancellable = useCancellablePromise();
  const [realName, setRealName] = useState<string | undefined>(undefined);

  if (!user) throw new Error("User is undefined. ");

  const getMe = () =>
    pipe(
      pipe(call(Operator.getMe)({ settings: makeSettings() }), toResultTask)(),
      makeCancellable
    ).then((x) => setRealName(x.Nome));

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
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          {avatar}

          <View
            style={{
              marginTop: 20,
            }}
          >
            {userName}
          </View>

          <Caption style={styles.caption}>@{user.username}</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection} focusable={false}>
          <List.Item
            title="Dashboard"
            left={(props) => <List.Icon {...props} icon="palette" />}
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          />
          <List.AccordionGroup>
            <List.Accordion
              title="Magazzino"
              id="1"
              left={(props) => <List.Icon {...props} icon="warehouse" />}
            >
              <List.Item
                title="Movimenti"
                onPress={() => {
                  props.navigation.navigate("Movements");
                }}
              />
            </List.Accordion>
          </List.AccordionGroup>
          <List.AccordionGroup>
            <List.Accordion
              title="Attività"
              id="2"
              left={(props) => <List.Icon {...props} icon="animation-play" />}
            >
              <List.Item
                title="Attività"
                onPress={() => {
                  props.navigation.navigate("Activities");
                }}
              />
              <List.Item title="Operatori" disabled={true} />
              <List.Item title="Macchine" disabled={true} />
            </List.Accordion>
          </List.AccordionGroup>
        </Drawer.Section>
        <Drawer.Section title="Impostazioni" focusable={false}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => {
              props.navigation.navigate("Profile");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Preferences"
            onPress={() => {}}
          />
        </Drawer.Section>
        <Drawer.Section title="Prefrenze" focusable={false}>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
});

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
