import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, List, Title, Switch } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { RadioButton } from "../../../../components";
import {
  ActionType,
  ActionTypeKey,
  isRequiringMachine,
} from "../../../../types/ActionType";
import { getActionTypesData } from "../../../../data/ActionTypeResource";

const StopActivityCard = (): React.ReactElement => {
  const navigation = useNavigation();
  const [actionType, setActionType] = useState<ActionType>(
    ActionTypeKey.MachineAndOperator
  );
  const [isFromBarcode, setFromBarcode] = useState(true);
  return (
    <Card>
      <Card.Content>
        <Title>Stop Attività</Title>

        <View style={styles.mt16}>
          <List.Section title="Impostazioni">
            <List.Accordion title="Tipo Attività">
              <RadioButton<ActionType>
                selected={actionType.toString()}
                onSelectedChange={({ v }) => setActionType(v)}
                items={getActionTypesData()}
              />
            </List.Accordion>
            {isRequiringMachine(actionType) && (
              <List.Accordion title="Scelta Macchina">
                <List.Item
                  title="Da Barcode"
                  description="Scegli la macchina da barcode o da una lista"
                  right={() => (
                    <Switch
                      value={isFromBarcode}
                      onValueChange={setFromBarcode}
                    />
                  )}
                />
              </List.Accordion>
            )}
          </List.Section>
        </View>
        <View style={styles.mt16}>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate("StopActivity", {
                actionType: actionType,
                isMachineReadFromBarcode: isFromBarcode,
              })
            }
          >
            <Text>Stop Attività</Text>
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const StopActivityCardMemo = React.memo(StopActivityCard);

export { StopActivityCardMemo as StopActivityCard };

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
});
