import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import { NewMovementCard } from "./Actions";
import { Surface } from "react-native-paper";

const Movements = () => {
  return (
    <Surface style={styles.container}>
      <ScrollView>
        <Surface style={styles.content}>
          <Surface>
            <NewMovementCard />
          </Surface>
        </Surface>
      </ScrollView>
    </Surface>
  );
};

const MovementsMemo = React.memo(Movements);

export { MovementsMemo as Movements };

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { margin: 16 },
});
