import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { NewMovementCard } from "./Actions";

const Movements = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View>
            <NewMovementCard />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const MovementsMemo = React.memo(Movements);

export { MovementsMemo as Movements };

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
});
