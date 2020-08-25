import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, Card, Title } from "react-native-paper";

const StopActivityCard = (): React.ReactElement => {
  return (
    <Card>
      <Card.Content>
        <Title>Stop Attività</Title>

        <View style={styles.mt16}>
          <Button mode="contained" disabled={true}>
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
