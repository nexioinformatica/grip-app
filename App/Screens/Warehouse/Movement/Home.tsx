import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, FAB, Surface, Text } from "react-native-paper";

import { StackNavigationProp } from "@react-navigation/stack";

import { MovementStackParamList } from "./Stack";

type Props = {
  navigation: StackNavigationProp<MovementStackParamList, "Home">;
};

export const Home = ({ navigation }: Props) => {
  return (
    <Surface style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Card>
            <Card.Content>
              <Text>
                Aggiungi un nuovo movimento tramite il pulsante &quot;+&quot; in
                basso a destra.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("NewMovement")}
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
