import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StartActivityCard, StopActivityCard } from "./Actions";

const ActivitiesScreen = () => {
  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <View>
              <StartActivityCard />
            </View>

            <View style={styles.action}>
              <StopActivityCard />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const ActivitiesScreenMemo = React.memo(ActivitiesScreen);

export { ActivitiesScreenMemo as Activities };

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
  action: { marginTop: 24 },
});
