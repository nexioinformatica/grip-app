import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, FAB, Surface, Text } from "react-native-paper";

import { StackNavigationProp } from "@react-navigation/stack";

import { ActionTypeKey } from "../../../types/ActionType";
import { ManageActivityStatusParamList } from "./Stack";

type Props = {
  navigation: StackNavigationProp<ManageActivityStatusParamList, "Home">;
};

export const Home = ({ navigation }: Props): React.ReactElement => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Surface style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Card>
            <Card.Title title="Gestisci Attività" />
            <Card.Content>
              <Text>
                Gestisci le attività tramite il pulsante &quot;+&quot; in basso
                a destra.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <FAB.Group
        open={isOpen}
        icon={isOpen ? "close" : "plus"}
        actions={[
          {
            icon: "stop",
            label: "Stop",
            onPress: () => navigation.navigate("EndActivity"),
          },
          {
            icon: "pause",
            label: "Pausa",
            onPress: () =>
              navigation.navigate("StopActivity", {
                defaultActionType: ActionTypeKey.MachineAndOperator,
              }),
          },
          {
            icon: "play",
            label: "Inizia",
            onPress: () =>
              navigation.navigate("StartActivity", {
                defaultActionType: ActionTypeKey.MachineAndOperator,
              }),
          },
        ]}
        visible={true}
        onStateChange={({ open }) => setOpen(open)}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
