import React, { useState, useContext, Key, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Content, Button, Text, H2, H3 } from "native-base";
import {
  SimpleCard,
  ScanInputListData,
  ScanInputList,
  Dropdown,
  toItems,
  Item,
} from "../../components";
import {
  BarcodeEvent,
  ReasonTypes,
  NewMovement,
  ReasonType,
  SelectListItem,
} from "../../types";
import { ApiContext } from "../../stores";
import { pipe } from "fp-ts/lib/pipeable";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { Entry, Data } from "../../types/Util";
import { foldDefaultMap, foldDefault } from "../../util/fp";
import { identity } from "fp-ts/lib/function";

type ScrapToWarehouseNavigationProp = StackNavigationProp<RootStackParamList>;
type ScrapToWarehouseProps = {
  navigation: ScrapToWarehouseNavigationProp;
};

export function ScrapToWarehouse(
  props: ScrapToWarehouseProps
): React.ReactElement {
  const { navigation } = props;

  const { api } = useContext(ApiContext);

  const [sheetMetal, setSheetMetal] = useState<string>("");
  const [reasonType, setReasonType] = useState<O.Option<ReasonType>>(O.none);

  const [reasonTypes, setReasonTypes] = useState<
    O.Option<Data<ReasonType, string>>
  >(O.none);

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

  const getReasonTypes = () =>
    api
      .reasonTypes()()
      .then((data) => setReasonTypes(data))
      .catch((err) => console.log(err));

  const postMovement = (movement: NewMovement) =>
    api
      .newMovement(movement)()
      .then((data) => console.log(foldDefault({})(data)))
      .catch((err) => console.log("REERRORE", err));

  useEffect(() => {
    getReasonTypes();
  }, []);

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
          items={toItems(
            pipe(
              reasonTypes,
              foldDefaultMap([], (x) => x.data)
            )
          )}
          def={pipe(
            reasonTypes,
            foldDefaultMap(undefined, (x) =>
              pipe(
                x.default,
                foldDefaultMap(undefined, (y) => y)
              )
            )
          )}
          onValueChange={(x) => {
            setReasonType(O.some(x as ReasonType));
          }}
        />
        <Button
          full
          onPress={() =>
            // () => console.log("Fatto")
            postMovement({
              TipoCausale: pipe(
                reasonType,
                foldDefault<ReasonType>(ReasonType.Specified)
              ),
              Matricole: [],
              Quantita: [],
            })
          }
        >
          <Text>Invia</Text>
        </Button>
      </SimpleCard>
    </Content>
  );
}
