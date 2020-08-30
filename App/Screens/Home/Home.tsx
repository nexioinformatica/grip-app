import React from "react";
import { StyleSheet } from "react-native";

import {
  Card,
  Title,
  Paragraph,
  FAB,
  Surface,
  Caption,
} from "react-native-paper";
import { DecodeBarcodeCard } from "./Actions/DecodeBarcodeCard";

// const theme = useTheme();

export function Home(): React.ReactElement {
  return (
    <Surface style={styles.container}>
      <Surface>
        <Card>
          <Card.Content>
            <Title>Yeah!</Title>
            <Paragraph>Nessuna attività in programma.</Paragraph>
            <Caption style={{ ...styles.mt16 }}>
              Inizia un lavoro dal menù a sinistra.
            </Caption>
          </Card.Content>
        </Card>
      </Surface>
      <Surface style={styles.box}>
        <DecodeBarcodeCard />
      </Surface>
      <FAB style={styles.fab} icon="information-outline" disabled={true}></FAB>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
