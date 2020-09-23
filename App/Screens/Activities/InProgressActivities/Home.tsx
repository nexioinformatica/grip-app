import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Surface, Text, FAB, Card } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { InProgressActivitiesParamList } from "./Stack";

type Props = {
  navigation: StackNavigationProp<InProgressActivitiesParamList, "Home">;
};

export const Home = ({ navigation }: Props): React.ReactElement => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Surface style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Card>
            <Card.Title title="Lista Attività" />
            <Card.Content>
              <Text>
                Vedi le attività in corso tramite il pulsante &quot;+&quot; in
                basso a destra.
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
            icon: "format-list-bulleted",
            label: "Attività operatore",
            onPress: () => navigation.navigate("ListByOperator"),
          },
          {
            icon: "format-list-bulleted",
            label: "Attività macchina",
            onPress: () => navigation.navigate("ListByMachine"),
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
