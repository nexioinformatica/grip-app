import { Formik } from "formik";
import React, { useState } from "react";
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
  ActivityTypePickerFormField,
  MachineFormField,
} from "../../../components/FormField";
import { ExecutiveOrderFormSection } from "../../../components/FormSection";
import { Snackbar } from "../../../components/Snackbar";
import { FlatSurface } from "../../../components/Surface";
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
    <Surface style={{ height: "100%" }}>
      <ScrollView>
        <Surface style={styles.container}>
          <Card>
            <Card.Content>
              <Title>Inizia Attività</Title>

              <Caption>{getActionTypeName(actionType)}</Caption>

              <FlatSurface style={{ ...styles.mt16 }}>
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
                          <ActivityTypePickerFormField {...formikProps} />

                          {isRequiringMachine(actionType) && (
                            <MachineFormField {...formikProps} />
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
    </Surface>
  );
};

const StartActivityMemo = React.memo(StartActivity);

export { StartActivityMemo as StartActivity };

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
  formContainer: { elevation: 0 },
});
