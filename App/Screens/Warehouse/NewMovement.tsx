import React, { useState, useContext, Key, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Content, Button, Text, H2, H3 } from "native-base";
import { SimpleCard, Dropdown, toItems, ScanInput } from "../../components";
import { BarcodeEvent, NewMovement, ReasonType } from "../../types";
import { ApiContext } from "../../stores";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import { Data, Entries } from "../../types/Util";
import { foldDefaultMap, foldDefault } from "../../util/fp";

type NewMovementNavigationProp = StackNavigationProp<RootStackParamList>;
type NewMovementProps = {
  navigation: NewMovementNavigationProp;
  reasonTypeDefault?: ReasonType;
};

function NewMovementComponent(props: NewMovementProps): React.ReactElement {
  const { navigation } = props;
  const { reasonTypeDefault } = props;

  const { api } = useContext(ApiContext);

  // Movement Object
  const [sheetMetal, setSheetMetal] = useState<string>("");
  const [quantity, setQuantity] = useState<number | undefined>();
  const [reasonType, setReasonType] = useState<ReasonType | undefined>(
    reasonTypeDefault
  );

  // UI Form Data
  const [reasonTypes, setReasonTypes] = useState<Entries<ReasonType, string>>(
    []
  );

  // Api Wrappers
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

  // Handlers
  const handleScan = (setter: (barcodeValue: string) => void): void => {
    navigation.navigate("Scan", {
      onBarcodeScanned: (barcodeEvent: BarcodeEvent) =>
        setter(barcodeEvent.data),
    });
  };

  useEffect(() => {
    getReasonTypes();
  }, []);

  return (
    <Content padder>
      <SimpleCard>
        <H2>Nuovo Movimento Magazzino</H2>
        <Text>
          Notifica un nuovo movimento al magazzino indicando matricola del
          materiale, quantità e tipo del movimento.
        </Text>
      </SimpleCard>
      <SimpleCard>
        <H3>Dati</H3>
        <ScanInput
          key="sheet_metal"
          placeholder="Lamiera"
          value={sheetMetal}
          onChangeText={(t: string) => setSheetMetal(t)}
          onIconPress={() => handleScan(setSheetMetal)}
          containerStyle={{ marginBottom: 10 }}
        />
        <ScanInput
          key="quantity"
          placeholder="Quantità"
          value={quantity ? quantity.toString() : ""}
          onChangeText={(t: string) => setQuantity(Number.parseInt(t))}
          onIconPress={() =>
            handleScan((b: string) => setQuantity(Number.parseInt(b)))
          }
          containerStyle={{ marginBottom: 10 }}
        />
        <Dropdown
          items={toItems(reasonTypes, (k) => k as number)}
          selected={(reasonType && (reasonType as number)) || undefined}
          onValueChange={(x) => {
            setReasonType(x.key);
          }}
        />
        <Button
          full
          onPress={() =>
            // () => console.log("Fatto")
            postMovement({
              TipoCausale: pipe(
                O.fromNullable(reasonType),
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

export { NewMovementComponent as NewMovement };
