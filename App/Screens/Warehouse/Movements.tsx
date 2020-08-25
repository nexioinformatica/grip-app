import React, { useContext, useEffect, useState, memo } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  WarehouseStack,
  MovementsStack,
  MovementsStackParamList,
} from "./Stacks";
import {
  Button,
  Card,
  Title,
  Paragraph,
  Caption,
  Headline,
  Subheading,
  Divider,
} from "react-native-paper";
import {
  StackNavigationProp,
  StackNavigationOptions,
} from "@react-navigation/stack";

type Props = { navigation: StackNavigationProp<MovementsStackParamList> };

export const Movements = memo((props: Props) => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Movimenti</Title>

          <View style={styles.mt16}>
            <Button
              mode="contained"
              onPress={() => props.navigation.navigate("NewMovement")}
            >
              <Text>Nuovo</Text>
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
});
