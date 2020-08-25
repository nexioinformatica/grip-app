import React, { useState, memo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, Card, Title, List } from "react-native-paper";
import { RadioButton } from "../../../../components/RadioButton/RadioButton";
import { getActionTypesData } from "../../../../data/ActionTypeResource";
import { ActionType, ActionTypeKey } from "../../../../types/ActionType";
import { useNavigation } from "@react-navigation/native";

export const StartActivityCard = memo(() => {
  const navigation = useNavigation();
  const [actionType, setActionType] = useState<ActionType>(
    ActionTypeKey.MachineAndOperator
  );
  return (
    <Card>
      <Card.Content>
        <Title>Inizio Attività</Title>

        <View style={styles.mt16}>
          <List.Section title="Impostazioni">
            <List.Accordion title="Tipo Attività">
              <RadioButton<ActionType>
                selected={actionType.toString()}
                onSelectedChange={({ v }) => setActionType(v)}
                items={getActionTypesData()}
              />
            </List.Accordion>
          </List.Section>
        </View>
        <View style={styles.mt16}>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate("StartActivity", {
                actionType: actionType,
              })
            }
          >
            <Text>Nuova Attività</Text>
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
});

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
});
