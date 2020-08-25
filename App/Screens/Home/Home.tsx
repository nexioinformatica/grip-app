import React from "react";
import { StyleSheet, View } from "react-native";

import { Card, Title, Paragraph, FAB } from "react-native-paper";
import { theme } from "../../util/theme";
import { DecodeBarcodeCard } from "./Actions/DecodeBarcodeCard";

export function Home(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View>
        <Card>
          <Card.Content>
            <Title>Yeah!</Title>
            <Paragraph>Nessuna attività in programma.</Paragraph>
            <Paragraph style={{ ...styles.label, ...styles.mt16 }}>
              Inizia un lavoro dal menù a sinistra.
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.box}>
        <DecodeBarcodeCard />
      </View>
      <FAB style={styles.fab} icon="information-outline" disabled={true}></FAB>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
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
  label: {
    color: theme.colors.secondary,
  },
});
