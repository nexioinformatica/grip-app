import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Content, Button, Text, H2, H3 } from "native-base";
import { SimpleCard, ScanInputListData, ScanInputList } from "../../components";
import { BarcodeEvent } from "../../types";

type ScrapToWarehouseNavigationProp = StackNavigationProp<RootStackParamList>;
type ScrapToWarehouseProps = {
  navigation: ScrapToWarehouseNavigationProp;
};

export function ScrapToWarehouse(
  props: ScrapToWarehouseProps
): React.ReactElement {
  const { navigation } = props;

  const [sheetMetal, setSheetMetal] = useState<string>("");

  const data: ScanInputListData = [
    {
      key: "sheet_metal",
      value: sheetMetal,
      onChangeText: (t: string) => setSheetMetal(t),
      title: "Lamiera",
      onIconPress: () =>
        navigation.navigate("Scan", {
          onBarcodeScanned: (barcodeEvent: BarcodeEvent) =>
            setSheetMetal(barcodeEvent.data),
        }),
    },
  ];

  return (
    <Content padder>
      <SimpleCard>
        <H2>Scarto a Magazzino</H2>
        <Text>Notifica lo scarto di lamiera al gestionale.</Text>
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
