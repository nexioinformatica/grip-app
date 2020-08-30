import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, Card, List, Title } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { RadioButton } from "../../../../components/RadioButton/RadioButton";
import { FlatSurface } from "../../../../components/Surface";
import { getActionTypesData } from "../../../../data/ActionTypeResource";
import { ActionType, ActionTypeKey } from "../../../../types/ActionType";

const StartActivityCard = (): React.ReactElement => {
  const navigation = useNavigation();
  const [actionType, setActionType] = useState<ActionType>(
    ActionTypeKey.MachineAndOperator
  );
  return (
    <Card>
      <Card.Content>
        <Title>Inizio Attività</Title>

        <FlatSurface style={styles.mt16}>
          <List.Section title="Impostazioni">
            <List.Accordion title="Tipo Attività">
              <RadioButton<ActionType>
                selected={actionType.toString()}
                onSelectedChange={({ v }) => setActionType(v)}
                items={getActionTypesData()}
              />
            </List.Accordion>
          </List.Section>
        </FlatSurface>
        <FlatSurface style={styles.mt16}>
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
        </FlatSurface>
      </Card.Content>
    </Card>
  );
};

const StartActivityCardMemo = React.memo(StartActivityCard);

export { StartActivityCardMemo as StartActivityCard };

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
});
