import React, { useState, useEffect, useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Content, Text, H2, H3, Button } from "native-base";
import { RootStackParamList } from "../Screens";
import { SimpleCard, ScanFreshman, Dropdown } from "../../components";
import { ActionType, ActionTypeKey } from "../../types";
import { ApiContext } from "../../stores";

// import { Button } from "react-native-elements";

type StartProcessingNavigationProp = StackNavigationProp<RootStackParamList>;
type StartProcessingProps = {
  navigation: StartProcessingNavigationProp;
};

export function StartProcessing(
  props: StartProcessingProps
): React.ReactElement {
  const { navigation } = props;
  const { api } = useContext(ApiContext);

  const [job, setJob] = useState<string | undefined>("");
  const [machine, setMachine] = useState<string | undefined>("");
  const [sheetMetal, setSheetMetal] = useState<string | undefined>("");
  const [actionTypes, setActionTypes] = useState<ActionType[]>([]);
  const [actionType, setActionType] = useState<ActionTypeKey>(
    ActionTypeKey.MachineAndOperator
  );

  const getActionTypes = () =>
    api
      .actionTypes()()
      .then((res) => setActionTypes(res));

  useEffect(() => {
    getActionTypes();
  }, []);

  const handleSend = () => {
    console.log(
      JSON.stringify({
        job: job,
        machine: machine,
        sheetMetal: sheetMetal,
        actionType: actionType,
      })
    );
  };

  return (
    <Content padder>
      <SimpleCard>
        <H2>Inizio Lavorazione</H2>
        <Text>
          Notifica l'inizio della lavorazione al gestionale indicando fase di
          lavorazione, macchina, lamiera e tipologia e motivazione (opzionale).
        </Text>
      </SimpleCard>
      <SimpleCard>
        <H3>Dati</H3>

        <ScanFreshman
          key="job"
          placeholder="Fase di lavorazione"
          value={job}
          onChangeValue={setJob}
          onDecodeValue={(decoded) => {}} // TODO: handle decoded
        />

        <ScanFreshman
          key="machine"
          placeholder="Macchina"
          value={machine}
          onChangeValue={setMachine}
          onDecodeValue={(decoded) => {}} // TODO: handle decoded
        />

        <ScanFreshman
          key="sheet_metal"
          placeholder="Lamiera"
          value={sheetMetal}
          onChangeValue={setSheetMetal}
          onDecodeValue={(decoded) => {}} // TODO: handle decoded
        />

        <Dropdown<ActionTypeKey>
          items={actionTypes.map((x) => ({
            value: x.key,
            label: x.label,
          }))}
          selected={actionType}
          onValueChange={setActionType}
        />

        <Button full onPress={() => handleSend()}>
          <Text>Invia</Text>
        </Button>
      </SimpleCard>
    </Content>
  );
}
