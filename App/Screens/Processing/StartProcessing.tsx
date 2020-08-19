import { Field, Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Activities, Barcode } from "geom-api-ts-client";
import { Button, Content, H2, H3, Text, Toast, View } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import { StackNavigationProp } from "@react-navigation/stack";

import { Dropdown, ScanFreshman, SimpleCard } from "../../components";
import { ApiContext } from "../../stores";
import { makeSettings } from "../../util/api";
import { addProp, teFold, tNever, tOf, aHead, oFold } from "../../util/fp";
import { generalErrorToast, generalSuccessToast } from "../../util/ui";
import { RootStackParamList } from "../Screens";

type StartProcessingNavigationProp = StackNavigationProp<RootStackParamList>;
type StartProcessingProps = {
  navigation: StartProcessingNavigationProp;
};

type NewActivity = Activities.NewActivity;
type ActionType = Activities.ActionType;
type ActionTypeKey = Activities.ActionTypeKey;
type ActivityType = Activities.ActivityType.ActivityType;

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface FormValues {
  activityType: Activities.ActivityType.ActivityType | undefined;
  actionType: Activities.ActionTypeKey;
  machine: any;
  operativeUnit: any;
  header: any;
  position: any;
  phase: any;
  machineBarcode: string;
  operativeUnitBarcode: string;
  headerBarcode: string;
  positionBarcode: string;
  phaseBarcode: string;
}

const validationSchema = Yup.object({
  activityType: Yup.object().required(),
  actionType: Yup.number().required(),

  machine: Yup.mixed().notRequired(),

  operativeUnit: Yup.mixed().notRequired(),
  header: Yup.mixed().notRequired(),
  position: Yup.mixed().notRequired(),
  phase: Yup.mixed().notRequired(),
});

function StartProcessingComponent(
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  props: StartProcessingProps
): React.ReactElement {
  const { call } = useContext(ApiContext);

  const [activityTypes, setActivityTypes] = useState<
    Activities.ActivityType.Collection
  >([]);
  const actionTypes = [
    {
      key: Activities.ActionTypeKey.MachineAndOperator,
      label: "Macchina e Operatore",
    },
    { key: Activities.ActionTypeKey.Machine, label: "Macchina" },
    { key: Activities.ActionTypeKey.Operator, label: "Operatore" },
  ];

  const [initialValues, setInitialValues] = useState<FormValues>({
    activityType: undefined,
    actionType: Activities.ActionTypeKey.MachineAndOperator,
    machine: undefined,
    operativeUnit: undefined,
    header: undefined,
    position: undefined,
    phase: undefined,
    machineBarcode: "",
    operativeUnitBarcode: "",
    headerBarcode: "",
    positionBarcode: "",
    phaseBarcode: "",
  });

  useEffect(() => {
    pipe(
      call(Activities.ActivityType.getCollection)({ settings: makeSettings() }),
      teFold(
        () => tNever,
        (res) => {
          setActivityTypes(res);
          return tOf(res);
        }
      )
    )();
  }, []);

  return (
    <Content padder>
      <SimpleCard>
        <H2>Inizio Lavorazione</H2>
        <Text>
          Notifica l&apos;inizio della lavorazione al gestionale indicando fase
          di lavorazione, macchina, lamiera e tipologia e motivazione
          (opzionale).
        </Text>
      </SimpleCard>
      <SimpleCard>
        <H3>Dati</H3>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const activity: NewActivity = makeActivity(values);

            return pipe(
              call(Activities.start)({
                value: activity,
                settings: makeSettings(),
              }),
              teFold(
                () => {
                  Toast.show(generalErrorToast);
                  return tOf(undefined);
                },
                (res) => {
                  Toast.show(generalSuccessToast);
                  return tOf(res);
                }
              )
            )();
          }}
        >
          {({
            handleSubmit,
            handleChange,
            errors,
            isSubmitting,
            isValid,
            setFieldValue,
            values,
            resetForm,
            // Should we have to use `handleBlur` and `touched`?
          }) => {
            useEffect(() => {
              setInitialValues({
                ...initialValues,
                activityType: pipe(
                  activityTypes,
                  aHead,
                  oFold(
                    () => undefined,
                    (v) => v
                  )
                ),
              });
            }, [activityTypes]);

            return (
              <>
                {!isValid && (
                  <View style={{ ...styles.groupFirst, ...styles.error }}>
                    {Object.values(errors).map((x, i) => (
                      <Text key={i}>{x}</Text>
                    ))}
                  </View>
                )}
                <View style={isValid ? styles.group : styles.groupFirst}>
                  <Text>
                    Specificare <i>Tipo Azione</i> e <i>Tipo Attività</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="actionType"
                      as={Dropdown}
                      items={actionTypes.map((x) => ({
                        key: x.key,
                        value: x.key,
                        label: x.label,
                      }))}
                      selected={values.actionType.valueOf()}
                      onSelectedChange={({
                        k,
                      }: {
                        k: ActionTypeKey;
                        v: ActionType;
                      }) => {
                        setFieldValue("actionType", k);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <Field
                      name="activityType"
                      as={Dropdown}
                      items={activityTypes.map((x) => ({
                        key: x.IdTipoAttivita,
                        value: x,
                        label: `(${x.Codice}) ${x.Descrizione}`,
                      }))}
                      selected={values.activityType?.IdTipoAttivita}
                      onSelectedChange={({
                        v,
                      }: {
                        k: number;
                        v: ActivityType;
                      }) => {
                        setFieldValue("activityType", v);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare la <i>Macchina</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="machine"
                      as={ScanFreshman}
                      placeholder="Macchina"
                      value={values.machineBarcode}
                      onChangeValue={handleChange("machineBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        console.log(decoded);
                        setFieldValue("machine", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare l&apos;<i>Unità Operativa</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="operativeUnit"
                      as={ScanFreshman}
                      placeholder="Unita Operativa"
                      value={values.operativeUnitBarcode}
                      onChangeValue={handleChange("operativeUnitBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        console.log(decoded);
                        setFieldValue("operativeUnit", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare l&apos;<i>Ordine Esecutivo</i>,
                    composto da Testata, Posizione e Fase,
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="header"
                      as={ScanFreshman}
                      placeholder="Testata"
                      value={values.headerBarcode}
                      onChangeValue={handleChange("headerBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        console.log(decoded);
                        setFieldValue("header", decoded);
                      }}
                    />
                  </View>

                  <View style={styles.item}>
                    <Field
                      name="position"
                      as={ScanFreshman}
                      placeholder="Posizione"
                      value={values.positionBarcode}
                      onChangeValue={handleChange("positionBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        console.log(decoded);
                        setFieldValue("position", decoded);
                      }}
                    />
                  </View>

                  <View style={styles.item}>
                    <Field
                      name="phase"
                      as={ScanFreshman}
                      placeholder="Fase"
                      value={values.phaseBarcode}
                      onChangeValue={handleChange("phaseBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        console.log(decoded);
                        setFieldValue("phase", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <View style={styles.item}>
                    <Button
                      full
                      primary
                      onPress={handleSubmit}
                      disabled={isSubmitting || !isValid}
                    >
                      <Text>Invia</Text>
                    </Button>
                  </View>
                  <View style={styles.item}>
                    <Button
                      full
                      onPress={() => resetForm(initialValues as any)}
                      disabled={isSubmitting}
                    >
                      <Text>Reset</Text>
                    </Button>
                  </View>
                </View>
              </>
            );
          }}
        </Formik>
      </SimpleCard>
    </Content>
  );
}

export { StartProcessingComponent as StartProcessing };

const makeActivity = (values: FormValues): NewActivity => ({
  ...{
    // FIXME: Find a way to produce new non-null object after validation and remove the non null assertion.
    /* eslint-disable  @typescript-eslint/no-non-null-assertion */
    IdTipoAttivita: values.activityType!.IdTipoAttivita,
    TipoAzione: values.actionType,
  },
  ...pipe(
    {},
    addProp("IdMacchina", values.machine && values.machine.IdMacchina),
    addProp(
      "IdUnitaOperativa",
      values.operativeUnit && values.operativeUnit.IdUnitaOperativa
    ),
    addProp("IdTestataOrdine", values.header && values.header.IdTestataOrdine),
    addProp(
      "IdPosizioneOrdine",
      values.position && values.position.IdPosizioneOrdine
    ),
    addProp(
      "IdFaseLavorazioneOrdine",
      values.phase && values.phase.IdFaseLavorazioneOrdine
    )
  ),
});

const styles = StyleSheet.create({
  group: { marginTop: "1.5em", width: "100%" },
  groupFirst: { marginTop: "0.5em", width: "100%" },
  item: { marginTop: "0.5em" },
  error: { color: "#ff0" },
});
