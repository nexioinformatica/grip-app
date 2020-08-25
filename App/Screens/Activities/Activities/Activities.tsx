import React, { useContext, useEffect, useState, memo } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { ActivitiesStackParamList } from "../Stacks";
import {
  Button,
  Card,
  Title,
  Paragraph,
  Caption,
  Headline,
  Subheading,
  Divider,
  List,
} from "react-native-paper";
import {
  StackNavigationProp,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { Activities } from "geom-api-ts-client";
import { number } from "yup";
import { RadioButton } from "../../../components";
import { ReasonTypeKey } from "geom-api-ts-client/dist/resources/warehouse/movement";
import { getActionTypesData } from "../../../data/ActionTypeResource";
import { StartActivityCard, StopActivityCard } from "./Actions";

type Props = { navigation: StackNavigationProp<ActivitiesStackParamList> };

const ActivitiesScreen = memo((props: Props) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View>
            <StartActivityCard />
          </View>

          <View style={styles.action}>
            <StopActivityCard />
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export { ActivitiesScreen as Activities };

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
  action: { marginTop: 24 },
});
