import { Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { Activities } from "geom-api-ts-client";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Caption,
  Card,
  List,
  Surface,
  Text,
  Title,
} from "react-native-paper";
import * as Yup from "yup";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import {
  StopActivityByMachineFormSection,
  StopActivityByOperatorFormSection,
} from "../../../components/FormSection";
import { Snackbar } from "../../../components/Snackbar";
import { FlatSurface } from "../../../components/Surface";
import { ApiContext } from "../../../stores";
import {
  ActionType,
  ActionTypeKey,
  getActionTypeName,
  isRequiringMachine,
} from "../../../types/ActionType";
import { MachineActivity, OperatorActivity } from "../../../types/Activity";
import { Machine } from "../../../types/Machine";
import { Operator } from "../../../types/Operator";
import { makeSettings } from "../../../util/api";
import { teLeft, toResultTask } from "../../../util/fp";
import { ActivitiesStackParamList } from "../Stacks";

type Props = {
  navigation: StackNavigationProp<ActivitiesStackParamList, "StopActivity">;
  route: RouteProp<ActivitiesStackParamList, "StopActivity">;
};

interface FormValues {
  machine?: Machine;
  machineActivity?: MachineActivity;
  operator?: Operator;
  operatorActivity?: OperatorActivity;
  barcode: {
    machine: string;
  };
}

const initialValues: FormValues = {
  machine: undefined,
  machineActivity: undefined,
  operator: undefined,
  operatorActivity: undefined,
  barcode: {
    machine: "",
  },
};

const validationSchema = (actionType: ActionType) => {
  const machine = isRequiringMachine(actionType)
    ? {
        machine: Yup.mixed().required("Il campo Macchina è richiesto"),
        machineActivity: Yup.mixed().required(
          "Il campo Attività Macchina è richiesto"
        ),
      }
    : {};
  const operator = !isRequiringMachine(actionType)
    ? {
        operator: Yup.mixed().required("Il campo Operatore è richiesto"),
        operatorActivity: Yup.mixed().required(
          "Il campo Attività Operatore è richiesto"
        ),
      }
    : {};
  return Yup.object({
    ...machine,
    ...operator,
  });
};

export const StopActivity = (props: Props): React.ReactElement => {
  const {
    route: {
      params: { actionType, isMachineReadFromBarcode },
    },
  } = props;
  const { call } = useContext(ApiContext);
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const stopAllByMachineActivity = (values: FormValues) =>
    call(Activities.stopAllByMachineActivity)({
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      IdAttivitaMacchina: values.machineActivity!.IdAttivitaMacchina,
      settings: makeSettings(),
    });

  const stopByMachineActivity = (values: FormValues) =>
    call(Activities.stopByMachineActivity)({
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      IdAttivitaMacchina: values.machineActivity!.IdAttivitaMacchina,
      settings: makeSettings(),
    });

  const stopByOperatorActivity = (values: FormValues) =>
    call(Activities.stopByOperatorActivity)({
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      IdAttivitaOperatore: values.operatorActivity!.IdAttivitaOperatore,
      settings: makeSettings(),
    });

  const getStopPromise = (
    actionType: ActionType
  ): ((values: FormValues) => TE.TaskEither<Error, unknown>) => {
    if (actionType === ActionTypeKey.MachineAndOperator)
      return stopAllByMachineActivity;
    if (actionType === ActionTypeKey.Machine) return stopByMachineActivity;
    if (actionType === ActionTypeKey.Operator) return stopByOperatorActivity;
    return () =>
      teLeft(
        new Error("Invalid ActionType supplied in StopActivity.handleSubmit")
      );
  };

  const handleSubmit = async (values: FormValues) => {
    return pipe(values, getStopPromise(actionType), toResultTask)()
      .then(() => {
        setSuccess(true);
      })
      .catch(() => setError(true));
  };

  return (
    <Surface style={{ height: "100%" }}>
      <ScrollView>
        <Surface style={styles.container}>
          <Card>
            <Card.Content>
              <Title>Stop Attività</Title>

              <Caption>{getActionTypeName(actionType)}</Caption>
              <Caption>
                Macchina letta da{" "}
                {isMachineReadFromBarcode ? "Barcode" : "Lista"}
              </Caption>

              <FlatSurface
                style={{
                  ...styles.mt16,
                }}
              >
                <Formik<FormValues>
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={validationSchema(actionType)}
                  onSubmit={handleSubmit}
                >
                  {(formikProps) => {
                    const {
                      handleSubmit,
                      isSubmitting,
                      isValid,
                      resetForm,
                    } = formikProps;

                    return (
                      <>
                        <List.Accordion
                          title="Dati Obbligatori"
                          expanded={true}
                        >
                          {(isRequiringMachine(actionType) && (
                            <StopActivityByMachineFormSection
                              isMachineReadFromBarcode={
                                isMachineReadFromBarcode
                              }
                              {...formikProps}
                            />
                          )) || (
                            <StopActivityByOperatorFormSection
                              {...formikProps}
                            />
                          )}
                        </List.Accordion>

                        <Button
                          mode="contained"
                          style={styles.mt16}
                          disabled={!isValid || isSubmitting}
                          loading={isSubmitting}
                          onPress={handleSubmit}
                        >
                          <Text>Invia</Text>
                        </Button>
                        <Button
                          mode="text"
                          style={styles.mt16}
                          disabled={isSubmitting}
                          onPress={resetForm}
                        >
                          <Text>Reset</Text>
                        </Button>
                      </>
                    );
                  }}
                </Formik>
              </FlatSurface>
            </Card.Content>
          </Card>
        </Surface>
      </ScrollView>
      <Snackbar
        visible={isError}
        onDismiss={() => {
          setError(false);
        }}
        duration={3000}
      >
        <Text>Coff coff, qualcosa è andato storto</Text>
      </Snackbar>
      <Snackbar
        visible={isSuccess}
        onDismiss={() => {
          setSuccess(false);
        }}
        duration={3000}
      >
        <Text>Operazione effettuata con successo</Text>
      </Snackbar>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
  formContainer: { elevation: 0 },
});
