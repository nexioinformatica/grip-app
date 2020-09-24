import { Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Activities, Barcode } from "geom-api-ts-client";
import { ActionTypeKey } from "geom-api-ts-client/dist/resources/activities";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Caption, Card, List, Surface } from "react-native-paper";
import * as Yup from "yup";

import useCancelablePromise from "@rodw95/use-cancelable-promise";

import {
  ActivityTypePickerFormField,
  MachineFormField,
  PhaseFormField,
} from "../../../../components/FormField";
import { ExecutiveOrderFormSection } from "../../../../components/FormSection";
import { RadioButton } from "../../../../components/RadioButton";
import {
  ErrorSnackbar,
  SuccessSnackbar,
} from "../../../../components/Snackbar";
import { FlatSurface } from "../../../../components/Surface";
import { getActionTypesData } from "../../../../data/ActionTypeResource";
import { ApiContext } from "../../../../stores";
import {
  ActionType,
  getActionTypeName,
  isRequiringMachine,
} from "../../../../types/ActionType";
import { ActivityType } from "../../../../types/ActivityType";
import { makeSettings } from "../../../../util/api";
import { toResultTask } from "../../../../util/fp";

interface FormValues {
  machine?: { IdMacchina: number };
  activityType?: ActivityType;
  phase?: Barcode.PhaseDecode;
  position?: Barcode.PositionDecode;
  header?: Barcode.HeaderDecode;

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
    phase: Yup.mixed().required("Il campo Fase è richiesto"),
    ...machine,
  });
};

export const StartActivity = (): React.ReactElement => {
  const makeCancelable = useCancelablePromise();
  const { call } = useContext(ApiContext);
  const [actionType, setActionType] = useState(
    ActionTypeKey.MachineAndOperator
  );

  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);

  const handleSubmit = (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) =>
    pipe(
      pipe(
        call(Activities.start)({
          value: makeValue(actionType)(values),
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then(() => {
          resetForm();
          setSuccess(true);
        })
        .catch(() => setError(true)),
      makeCancelable
    );

  return (
    <Surface style={{ height: "100%" }}>
      <ScrollView>
        <Surface style={styles.container}>
          <Card>
            <Card.Title title="Start attività" />
            <Card.Content>
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
                      isSubmitting,
                      isValid,
                      resetForm,
                    } = formikProps;

                    return (
                      <>
                        <List.Accordion title="Tipo Azione">
                          <RadioButton<ActionType>
                            selected={actionType.toString()}
                            onSelectedChange={({ v }) => setActionType(v)}
                            items={getActionTypesData()}
                          />
                        </List.Accordion>

                        <List.Accordion
                          title="Dati Obbligatori"
                          expanded={true}
                        >
                          <ActivityTypePickerFormField {...formikProps} />

                          {isRequiringMachine(actionType) && (
                            <MachineFormField {...formikProps} />
                          )}

                          <PhaseFormField {...formikProps} />
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
                          Invia
                        </Button>
                        <Button
                          mode="text"
                          style={styles.mt16}
                          disabled={isSubmitting}
                          onPress={resetForm}
                        >
                          Reset
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
      <SuccessSnackbar isSuccess={isSuccess} setSuccess={setSuccess} />
      <ErrorSnackbar isError={isError} setError={setError} />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
  formContainer: { elevation: 0 },
});

const makeValue = (actionType: ActionTypeKey) => (
  formValues: FormValues
): Activities.NewActivity => ({
  TipoAzione: actionType,
  IdTipoAttivita: formValues.activityType!.IdTipoAttivita,
  IdMacchina: formValues.machine?.IdMacchina,
  IdFaseLavorazioneOrdine: formValues.phase?.Oggetto.IdFase,
  IdPosizioneOrdine: formValues.position?.Oggetto.IdPosizione,
  IdTestataOrdine: formValues.header?.Oggetto.IdTestata,
});
