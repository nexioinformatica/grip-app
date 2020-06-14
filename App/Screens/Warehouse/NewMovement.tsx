import React, { useState, useContext, Key, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Content, Button, Text, H2, H3 } from "native-base";
import {
  SimpleCard,
  Dropdown,
  toItems,
  ScanInput,
  ScanFreshman,
} from "../../components";
import {
  BarcodeEvent,
  NewMovement,
  ReasonType,
  Movement,
  BarcodeDecode,
} from "../../types";
import { ApiContext } from "../../stores";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Entries } from "../../types/Util";
import { foldDefault } from "../../util/fp";
import { RouteProp } from "@react-navigation/native";

type NewMovementNavigationProp = StackNavigationProp<RootStackParamList>;
type NewMovementRouteProp = RouteProp<RootStackParamList, "NewMovement">;
type NewMovementProps = {
  navigation: NewMovementNavigationProp;
  route: NewMovementRouteProp;
};

function NewMovementComponent(props: NewMovementProps): React.ReactElement {
  const { navigation, route } = props;
  const { reasonTypeDefault } = route.params;

  const { api } = useContext(ApiContext);

  // Movement Object
  const [freshman, setFreshman] = useState<string | undefined>();
  const [freshmanId, setFreshmanId] = useState<number | undefined>();
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
      .then((data: Entries<ReasonType, string>) => setReasonTypes(data));

  const postMovement = (movement: NewMovement) =>
    pipe(
      movement,
      api.newMovement,
      TE.fold(
        (err) => {
          console.log("ERRORE");
          return T.never;
        },
        (res) => {
          // TODO: use the value.
          console.log(res);
          return T.of(undefined);
        }
      )
    );

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
        <ScanFreshman
          key="freshman"
          placeholder="Matricola"
          value={freshman}
          onChangeValue={setFreshman}
          onDecodeValue={
            (decodedValue: BarcodeDecode[]) => setFreshmanId(decodedValue[0].Id) // TODO: change this!!!
          }
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
        <Dropdown<ReasonType>
          items={toItems(
            reasonTypes.map((x, i) => ({ label: x.value, key: x.key }))
          )}
          selected={(reasonType && (reasonType as number)) || undefined}
          onValueChange={(x) => {
            setReasonType(x);
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
