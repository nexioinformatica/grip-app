import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

import { StartActivityCard, StopActivityCard } from "./Actions";

const ActivitiesScreen = () => {
  return (
    <Surface style={styles.container}>
      <ScrollView>
        <Surface style={styles.content}>
          <Surface>
            <Surface>
              <StartActivityCard />
            </Surface>

            <Surface style={styles.action}>
              <StopActivityCard />
            </Surface>
          </Surface>
        </Surface>
      </ScrollView>
    </Surface>
  );
};

const ActivitiesScreenMemo = React.memo(ActivitiesScreen);

export { ActivitiesScreenMemo as Activities };

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
  action: { marginTop: 24 },
});
