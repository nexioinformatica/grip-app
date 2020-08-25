import React, { useState, memo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, Card, Title, List } from "react-native-paper";
import { RadioButton } from "../../../../components";
import { getActionTypesData } from "../../../../data/ActionTypeResource";
import { ActionType, ActionTypeKey } from "../../../../types/ActionType";
import { useNavigation } from "@react-navigation/native";

export const StopActivityCard = memo(() => {
  const navigation = useNavigation();
  const [actionType, setActionType] = useState<ActionType>(
    ActionTypeKey.MachineAndOperator
  );
  return (
    <Card>
      <Card.Content>
        <Title>Stop Attività</Title>

        <View style={styles.mt16}>
          <Button mode="contained" disabled={true} onPress={() => {}}>
            <Text>Stop Attività</Text>
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
});

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
});
