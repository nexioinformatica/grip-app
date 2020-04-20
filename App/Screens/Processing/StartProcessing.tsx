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
  H1,
  H2,
  Button,
} from "native-base";
import { RootStackParamList } from "../Screens";
import { ScanInput, SimpleCard } from "../../components";
import { BarCodeEvent } from "expo-barcode-scanner";
// import { Button } from "react-native-elements";

type StartProcessingNavigationProp = StackNavigationProp<RootStackParamList>;
type StartProcessingProps = {
  navigation: StartProcessingNavigationProp;
};

type ScanInputList = ScanInput[];
interface ScanInput {
  key: string;
  value: string;
  onChangeText: (t: string) => void;
  title: string;
  params: {
    onBarcodeScanned: (barcodeEvent: BarCodeEvent) => void;
  };
}

export function StartProcessing(
  props: StartProcessingProps
): React.ReactElement {
  const { navigation } = props;

  const [job, setJob] = useState<string>("");
  const [machine, setMachine] = useState<string>("");
  const [sheetMetal, setSheetMetal] = useState<string>("");

  // TODO: Card could be wrapped in a SimpleCard component, hiding Card, CardItem, Body
  // TODO: Move ScanInputList to a component

  const data: ScanInputList = [
    {
      key: "job",
      value: job,
      onChangeText: (t: string) => setJob(t),
      title: "Commessa",
      params: {
        onBarcodeScanned: (barcodeEvent: BarCodeEvent) =>
          setJob(barcodeEvent.data),
      },
    },
    {
      key: "machine",
      value: machine,
      onChangeText: (t: string) => setMachine(t),
      title: "Macchina",
      params: {
        onBarcodeScanned: (barcodeEvent: BarCodeEvent) =>
          setMachine(barcodeEvent.data),
      },
    },
    {
      key: "sheet_metal",
      value: sheetMetal,
      onChangeText: (t: string) => setSheetMetal(t),
      title: "Lamiera",
      params: {
        onBarcodeScanned: (barcodeEvent: BarCodeEvent) =>
          setSheetMetal(barcodeEvent.data),
      },
    },
  ];

  return (
    <Content padder>
      <SimpleCard>
        <H1>Inizio Lavorazione</H1>
        <Text>Notifica l'inizio della lavorazione al gestionale.</Text>
      </SimpleCard>
      <SimpleCard>
        <H2>Dati</H2>
        {data.map((d, i) => (
          <ScanInput
            key={d.key}
            placeholder={d.title}
            value={d.value}
            onChangeText={d.onChangeText}
            onIconPress={() => navigation.navigate("Scan", d.params)}
            containerStyle={styles.item}
          />
        ))}
        <Button full>
          <Text>Invia</Text>
        </Button>
      </SimpleCard>
    </Content>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
  },
});
