import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, List, Title } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { RadioButton } from "../../../../components/RadioButton/RadioButton";
import { getReasonTypesData } from "../../../../data/ReasonTypeResource";
import { ReasonType, ReasonTypeKey } from "../../../../types/ReasonType";

const NewMovementCard = (): React.ReactElement => {
  const navigation = useNavigation();
  const [reasonType, setReasonType] = useState<ReasonType>(
    ReasonTypeKey.LoadRemnant
  );

  return (
    <Card>
      <Card.Content>
        <Title>Nuovo Movimento</Title>

        <View style={styles.mt16}>
          <List.Section title="Impostazioni">
            <List.Accordion title="Tipo Causale">
              <RadioButton<ReasonType>
                selected={reasonType.toString()}
                onSelectedChange={({ v }) => setReasonType(v)}
                items={getReasonTypesData()}
              />
            </List.Accordion>
          </List.Section>
        </View>

        <View style={styles.mt16}>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate("NewMovement", {
                reasonType: reasonType,
              })
            }
          >
            <Text>Nuova Attività</Text>
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const NewMovementCardMemo = React.memo(NewMovementCard);

export { NewMovementCardMemo as NewMovementCard };

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
});
