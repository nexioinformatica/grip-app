import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Surface } from "react-native-paper";

import {
  DecodeBarcodeCard,
  Fabs,
  InProgressActivitiesSurface,
  OlderActivityInProgressSurface,
  QuickLinksCard,
  WelcomeCard,
} from "./Actions";

export function Home(): React.ReactElement {
  return (
    <Surface style={styles.container}>
      <ScrollView>
        <Surface style={styles.content}>
          <Surface>
            <WelcomeCard />
          </Surface>
          <Surface style={{ flex: 1, flexDirection: "row" }}>
            <Card style={{ ...styles.box, flex: 1, marginRight: 8 }}>
              <Card.Content>
                <InProgressActivitiesSurface />
              </Card.Content>
            </Card>
            <Card style={{ ...styles.box, flex: 1, marginLeft: 8 }}>
              <Card.Content>
                <OlderActivityInProgressSurface />
              </Card.Content>
            </Card>
          </Surface>
          <Surface style={styles.box}>
            <QuickLinksCard />
          </Surface>
          <Surface style={styles.box}>
            <DecodeBarcodeCard />
          </Surface>
        </Surface>
      </ScrollView>

      <Fabs />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  box: {
    marginTop: 16,
  },
  mt16: {
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
