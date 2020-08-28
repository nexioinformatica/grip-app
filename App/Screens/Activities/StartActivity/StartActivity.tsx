import { Formik } from "formik";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Caption,
  Card,
  List,
  Snackbar,
  Title,
} from "react-native-paper";
import * as Yup from "yup";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import {
  ActivityTypeFormSection,
  ExecutiveOrderFormSection,
  MachineFormSection,
} from "../../../components/Form";
import {
  ActionType,
  getActionTypeName,
  isRequiringMachine,
} from "../../../types/ActionType";
import { ActivityType } from "../../../types/ActivityType";
import { ActivitiesStackParamList } from "../Stacks";

type Props = {
  navigation: StackNavigationProp<ActivitiesStackParamList, "StartActivity">;
  route: RouteProp<ActivitiesStackParamList, "StartActivity">;
};

interface FormValues {
  machine?: { IdMacchina: number };
  activityType?: ActivityType;
  phase?: { IdFase: number };
  position?: { IdPosizione: number };
  header?: { IdTestata: number };

  barcode: {
    machine: string;
    phase: string;
    position: string;
    header: string;
  };
}

const initialValues: FormValues = {
  machine: undefined,
  activityType: undefined,
  phase: undefined,
  position: undefined,
  header: undefined,

  barcode: {
    machine: "",
    phase: "",
    position: "",
    header: "",
  },
};

const validationSchema = (actionType: ActionType) => {
  const machine = isRequiringMachine(actionType)
    ? {
        machine: Yup.mixed().required("Il campo Macchina è richiesto"),
      }
    : {};
  return Yup.object({
    activityType: Yup.mixed().required("Il campo Tipo Attività è richiesto"),
    ...machine,
  });
};

const StartActivity = (props: Props) => {
  const {
    route: {
      params: { actionType },
    },
  } = props;
  const [isError, setError] = useState(false);

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    // TODO: implement handle submit
    return Promise.reject().catch(() => {
      setError(true);
    });
  };

  return (
    <View style={{ height: "100%" }}>
      <ScrollView>
        <View style={styles.container}>
          <Card>
            <Card.Content>
              <Title>Inizia Attività</Title>

              <Caption>{getActionTypeName(actionType)}</Caption>

              <View style={styles.mt16}>
                <Formik<FormValues>
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={validationSchema(actionType)}
                  onSubmit={handleSubmit}
                >
                  {(formikProps) => {
                    const {
                      handleSubmit,
                      // handleChange,
                      // handleBlur,
                      // errors,
                      isSubmitting,
                      isValid,
                      // setFieldValue,
                      // values,
                      resetForm,
                    } = formikProps;

                    return (
                      <>
                        <List.Accordion
                          title="Dati Obbligatori"
                          expanded={true}
                        >
                          <ActivityTypeFormSection {...formikProps} />

                          {isRequiringMachine(actionType) && (
                            <MachineFormSection {...formikProps} />
                          )}
                        </List.Accordion>

                        <List.Accordion title="Ordine Esecutivo">
                          <ExecutiveOrderFormSection {...formikProps} />
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
              </View>
            </Card.Content>
          </Card>
        </View>
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
    </View>
  );
};

const StartActivityMemo = React.memo(StartActivity);

export { StartActivityMemo as StartActivity };

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
});
