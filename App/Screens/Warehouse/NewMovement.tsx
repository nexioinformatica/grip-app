import React, { useState, useContext, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Content, Button, Text, H2, H3, Toast } from "native-base";
import { Input } from "react-native-elements";
import { SimpleCard, Dropdown, ScanFreshman } from "../../components";
import {
  NewMovement,
  ReasonType,
  BarcodeDecode,
  ReasonTypeKey,
} from "../../types";
import { ApiContext } from "../../stores";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { foldDefault, log, allTrue, isUndefined, isEps } from "../../util/fp";
import { RouteProp } from "@react-navigation/native";
import { generalSuccessToast, generalErrorToast } from "../../util/ui";

type NewMovementNavigationProp = StackNavigationProp<RootStackParamList>;
type NewMovementRouteProp = RouteProp<RootStackParamList, "NewMovement">;
type NewMovementProps = {
  navigation: NewMovementNavigationProp;
  route: NewMovementRouteProp;
};

function NewMovementComponent(props: NewMovementProps): React.ReactElement {
  const { route } = props;
  const { reasonTypeDefault } = route.params;

  const { api } = useContext(ApiContext);

  // Movement Object
  const [freshman, setFreshman] = useState<string | undefined>();
  const [freshmanId, setFreshmanId] = useState<number | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [reasonType, setReasonType] = useState<ReasonTypeKey | undefined>(
    reasonTypeDefault
  );

  // UI Form Data
  const [reasonTypes, setReasonTypes] = useState<ReasonType[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);

  // Api Wrappers
  const getReasonTypes = () =>
    api
      .reasonTypes()()
      .then((data: ReasonType[]) => setReasonTypes(data));

  const sendMovement = (movement: NewMovement) =>
    pipe(
      movement,
      log,
      api.newMovement,
      TE.fold(
        (err) => {
          Toast.show(generalErrorToast);
          return T.never;
        },
        (res) => {
          // TODO: use the value.
          console.log(res);
          Toast.show(generalSuccessToast);
          return T.of(undefined);
        }
      )
    )();

  useEffect(() => {
    getReasonTypes();
  }, []);

  useEffect(() => {
    const values = [freshman, quantity, reasonType];
    setIsValid(
      pipe(
        values,
        allTrue((x: any) => !isUndefined(x) && !isEps(x))
      )
    );
  }, [freshman, quantity, reasonType]);

  const handleSubmit = () =>
    sendMovement({
      TipoCausale: pipe(
        O.fromNullable(reasonType),
        foldDefault<ReasonTypeKey>(ReasonTypeKey.Specified)
      ),
      Matricole: [],
      Quantita: [],
    });

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
          placeholder="Matricola"
          value={freshman}
          onChangeValue={setFreshman}
          onDecodeValue={
            (decodedValue: BarcodeDecode[]) => setFreshmanId(decodedValue[0].Id) // TODO: change this!!!
          }
          containerStyle={{ marginBottom: 10 }}
        />

        <Input
          key="quantity"
          placeholder="Quantità"
          value={quantity ? quantity.toString() : ""}
          onChangeText={(t: string) => setQuantity(Number.parseInt(t))}
          containerStyle={{ marginBottom: 10 }}
        />

        <Dropdown<ReasonTypeKey>
          items={reasonTypes.map((x) => ({ value: x.key, label: x.label }))}
          selected={reasonType}
          onValueChange={(x) => {
            setReasonType(x);
          }}
        />

        <Button full onPress={handleSubmit} disabled={!isValid}>
          <Text>Invia</Text>
        </Button>
      </SimpleCard>
    </Content>
  );
}

export { NewMovementComponent as NewMovement };
