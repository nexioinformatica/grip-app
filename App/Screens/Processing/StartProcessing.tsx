import React, { useState } from "react";
import {
  StackNavigationProp,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import {
  Content,
  Card,
  CardItem,
  Body,
  Text,
  H2,
  H3,
  Button,
} from "native-base";
import { RootStackParamList } from "../Screens";
import {
  ScanInputData,
  SimpleCard,
  ScanInputList,
  ScanInputListData,
} from "../../components";
import { BarCodeEvent } from "expo-barcode-scanner";

// import { Button } from "react-native-elements";

type StartProcessingNavigationProp = StackNavigationProp<RootStackParamList>;
type StartProcessingProps = {
  navigation: StartProcessingNavigationProp;
};

export function StartProcessing(
  props: StartProcessingProps
): React.ReactElement {
  const { navigation } = props;

  const [job, setJob] = useState<string>("");
  const [machine, setMachine] = useState<string>("");
  const [sheetMetal, setSheetMetal] = useState<string>("");

  // TODO: Card could be wrapped in a SimpleCard component, hiding Card, CardItem, Body
  // TODO: Move ScanInputList to a component

  const data: ScanInputListData = [
    {
      key: "job",
      value: job,
      onChangeText: (t: string) => setJob(t),
      title: "Commessa",
      onIconPress: () =>
        navigation.navigate("Scan", {
          onBarcodeScanned: (barcodeEvent: BarCodeEvent) =>
            setJob(barcodeEvent.data),
        }),
    },
    {
      key: "machine",
      value: machine,
      onChangeText: (t: string) => setMachine(t),
      title: "Macchina",
      onIconPress: () =>
        navigation.navigate("Scan", {
          onBarcodeScanned: (barcodeEvent: BarCodeEvent) =>
            setJob(barcodeEvent.data),
        }),
    },
    {
      key: "sheet_metal",
      value: sheetMetal,
      onChangeText: (t: string) => setSheetMetal(t),
      title: "Lamiera",
      onIconPress: () =>
        navigation.navigate("Scan", {
          onBarcodeScanned: (barcodeEvent: BarCodeEvent) =>
            setJob(barcodeEvent.data),
        }),
    },
  ];

  return (
    <Content padder>
      <SimpleCard>
        <H2>Inizio Lavorazione</H2>
        <Text>Notifica l'inizio della lavorazione al gestionale.</Text>
      </SimpleCard>
      <SimpleCard>
        <H3>Dati</H3>
        <ScanInputList scanInputList={data} />
        <Button full>
          <Text>Invia</Text>
        </Button>
      </SimpleCard>
    </Content>
  );
}
