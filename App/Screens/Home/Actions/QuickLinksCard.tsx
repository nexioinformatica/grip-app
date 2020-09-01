import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Card, List } from "react-native-paper";

export const QuickLinksCard = (): React.ReactElement => {
  const [isExpanded, setExpanded] = useState(true);
  const toggleExpanded = () => setExpanded(!isExpanded);
  return (
    <Card>
      <Card.Title title="Azioni rapide" />
      <Card.Content>
        <List.Accordion
          title="Azioni Rapide"
          expanded={isExpanded}
          onPress={toggleExpanded}
        >
          <Button mode="outlined">Inizia Attivita</Button>
          <Button mode="outlined" style={styles.button}>
            Pausa Attivita
          </Button>
          <Button mode="outlined" style={styles.button}>
            Ferma Attivita
          </Button>
          <Button mode="outlined" style={styles.button}>
            Avanzo a Magazzino
          </Button>
        </List.Accordion>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  button: { marginTop: 8 },
});
