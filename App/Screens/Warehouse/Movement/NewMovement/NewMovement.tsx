import { Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode, Warehouse } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Caption,
  Card,
  List,
  Surface,
  Text,
  Title,
  useTheme,
} from "react-native-paper";
import * as Yup from "yup";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { TextInputPicker } from "../../../../components/Dropdown";
import {
  FreshmanFormField,
  NewSubdivisionFormField,
  SubdivisionFormField,
} from "../../../../components/FormField";
import { ExecutiveOrderFormSection } from "../../../../components/FormSection";
import { RadioButton } from "../../../../components/RadioButton";
import { Snackbar } from "../../../../components/Snackbar";
import { FlatSurface } from "../../../../components/Surface";
import { getReasonTypesData } from "../../../../data/ReasonTypeResource";
import { ApiContext } from "../../../../stores";
import {
  Reason,
  ReasonItemsAdapterFactory,
  Reasons,
} from "../../../../types/Reason";
import {
  getReasonTypeName,
  isRequiringReason,
  ReasonType,
  ReasonTypeKey,
} from "../../../../types/ReasonType";
import { Subdivision } from "../../../../types/Subdivision";
import { makeSettings } from "../../../../util/api";
import { toResultTask } from "../../../../util/fp";
import { MovementStackParamList } from "../Stack";

type Props = {
  navigation: StackNavigationProp<MovementStackParamList, "NewMovement">;
  route: RouteProp<MovementStackParamList, "NewMovement">;
};

interface FormValues {
  reason: ReasonType | undefined;
  reasonTitle: string;

  freshman?: Barcode.FreshmanDecode;
  phase?: Barcode.PhaseDecode;
  position?: Barcode.PositionDecode;
  header?: Barcode.HeaderDecode;
  subdivision?: Subdivision;

  barcode: {
    freshman: string;
    phase: string;
    position: string;
    header: string;
  };
}

const initialValues: FormValues = {
  freshman: undefined,
  reason: undefined,
  phase: undefined,
  position: undefined,
  header: undefined,
  subdivision: undefined,

  reasonTitle: "",

  barcode: {
    freshman: "",
    phase: "",
    position: "",
    header: "",
  },
};

const validationSchema = (reasonType: ReasonType) => {
  const reason = isRequiringReason(reasonType)
    ? { reason: Yup.mixed().required("Il campo Causale è richiesto") }
    : {};
  return Yup.object({
    freshman: Yup.mixed().required("Il campo Matricola è richiesto"),
    ...reason,
  });
};

const NewMovement = (_props: Props): React.ReactElement => {
  const [reasonType, setReasonType] = useState(ReasonTypeKey.LoadRemnant);

  const makeCancelable = useCancellablePromise();
  const { call } = useContext(ApiContext);
  const theme = useTheme();

  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [reasons, setReasons] = useState<Reasons>([]);

  const getReasons = () =>
    makeCancelable(
      pipe(
        call(Warehouse.Reason.getCollection)({
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then(setReasons)
        .catch(() => setError(true))
    );

  useEffect(() => {
    getReasons();
  }, []);

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    // TODO: implement real handle submit
    return Promise.reject()
      .then(() => setSuccess(true))
      .catch(() => setError(true));
  };

  return (
    <Surface style={{ height: "100%" }}>
      <ScrollView>
        <FlatSurface style={styles.container}>
          <Card>
            <Card.Content>
              <Title>Nuovo Movimento</Title>
              <Caption>{getReasonTypeName(reasonType)}</Caption>

              <FlatSurface style={styles.mt16}>
                <Formik<FormValues>
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={validationSchema(reasonType)}
                  onSubmit={handleSubmit}
                >
                  {(formikProps) => {
                    const {
                      handleSubmit,
                      handleChange,
                      errors,
                      isSubmitting,
                      isValid,
                      setFieldValue,
                      values,
                      resetForm,
                    } = formikProps;
                    return (
                      <>
                        <List.Accordion title="Tipo Causale">
                          <RadioButton<ReasonType>
                            selected={reasonType.toString()}
                            onSelectedChange={({ v }) => setReasonType(v)}
                            items={getReasonTypesData()}
                          />
                        </List.Accordion>
                        <List.Accordion title="Movimento" expanded={true}>
                          {isRequiringReason(reasonType) && (
                            <TextInputPicker<Reason>
                              items={ReasonItemsAdapterFactory.fromReasons(
                                reasons
                              )}
                              value={values.reasonTitle}
                              onValueChange={(x) => {
                                handleChange("reasonTitle")(x.title);
                                setFieldValue("reason", x.value);
                              }}
                              label="Causale"
                              error={!!errors.reason}
                              errorText={errors.reason}
                            />
                          )}

                          <FreshmanFormField
                            {...formikProps}
                            label="Matricola*"
                          />
                          {values.freshman && (
                            <>
                              <SubdivisionFormField
                                {...formikProps}
                                freshman={values.freshman.Oggetto}
                              />
                              <NewSubdivisionFormField />
                            </>
                          )}
                        </List.Accordion>

                        <List.Accordion
                          title="Ordine Esecutivo"
                          style={styles.mt16}
                        >
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
        </FlatSurface>
      </ScrollView>
      <Snackbar
        visible={isError}
        onDismiss={() => {
          setError(false);
        }}
        duration={3000}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Text>Coff coff, qualcosa è andato storto</Text>
      </Snackbar>
      <Snackbar
        visible={isSuccess}
        onDismiss={() => {
          setSuccess(false);
        }}
        duration={3000}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Text>Operazione effettuata con successo</Text>
      </Snackbar>
    </Surface>
  );
};

const NewMovementMemo = React.memo(NewMovement);

export { NewMovementMemo as NewMovement };

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
});
