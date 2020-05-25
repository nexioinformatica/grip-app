import React, { useState, useContext, Key } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Content, Button, Text, H2, H3 } from "native-base";
import {
  SimpleCard,
  ScanInputListData,
  ScanInputList,
  Dropdown,
  Item,
} from "../../components";
import { BarcodeEvent, Reasons, Reason } from "../../types";
import { ApiContext } from "../../stores";
import { pipe } from "fp-ts/lib/pipeable";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";

type ScrapToWarehouseNavigationProp = StackNavigationProp<RootStackParamList>;
type ScrapToWarehouseProps = {
  navigation: ScrapToWarehouseNavigationProp;
};

const toItems = (reasons: Reasons): Item<Reason>[] =>
  pipe(
    reasons,
    A.map((x) => {
      return {
        label: x.Descrizione,
        value: x,
        key: x.IdCausale,
      };
    })
  );

export function ScrapToWarehouse(
  props: ScrapToWarehouseProps
): React.ReactElement {
  const { navigation } = props;

  const { api } = useContext(ApiContext);

  const [sheetMetal, setSheetMetal] = useState<string>("");
  const [reason, setReason] = useState<O.Option<Reason>>(O.none);

  const [reasons, setReasons] = useState<Reasons>([]);

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

  api
    .movementReasons()()
    .then((data) => setReasons(data))
    .catch((err) => console.log(err));

  return (
    <Content padder>
      <SimpleCard>
        <H2>Scarto a Magazzino</H2>
        <Text>Notifica lo scarto di lamiera al gestionale.</Text>
      </SimpleCard>
      <SimpleCard>
        <H3>Dati</H3>
        <ScanInputList scanInputList={data} />
        <Dropdown
          items={toItems(reasons)}
          onValueChange={(x: any) => setReason(O.some(x as Reason))}
        />
        <Button
          full
          onPress={() =>
            alert(
              // TODO: remove
              JSON.stringify({
                reason: pipe(
                  reason,
                  O.fold(
                    () => undefined,
                    (r) => r
                  )
                ),
                sheetMetal: sheetMetal,
              })
            )
          }
        >
          <Text>Invia</Text>
        </Button>
      </SimpleCard>
    </Content>
  );
}
