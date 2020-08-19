import { Field, Formik } from "formik";
import { not } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode, Warehouse } from "geom-api-ts-client";
import {
  Button,
  Content,
  H2,
  H3,
  Text,
  Textarea,
  Toast,
  View,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import * as Yup from "yup";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Dropdown, ScanFreshman, SimpleCard } from "../../components";
import { ApiContext } from "../../stores";
import { makeSettings } from "../../util/api";
import { aHead, oFold, teFold, tNever, tOf } from "../../util/fp";
import { generalErrorToast, generalSuccessToast } from "../../util/ui";
import { RootStackParamList } from "../Screens";

type NewMovementNavigationProp = StackNavigationProp<RootStackParamList>;
type NewMovementRouteProp = RouteProp<RootStackParamList, "NewMovement">;
type NewMovementProps = {
  navigation: NewMovementNavigationProp;
  route: NewMovementRouteProp;
};

type NewMovement = Warehouse.Movement.NewMovement;
type ReasonType = Warehouse.Movement.ReasonType;
const ReasonTypeKey = Warehouse.Movement.ReasonTypeKey;
type Reason = Warehouse.Reason.Reason;
type Reasons = Warehouse.Reason.Collection;

// FIXME: remove the eslint-disable when all this models have been implemented in the `geom-api-ts-client` lib.
/* eslint-disable  @typescript-eslint/no-explicit-any */
interface FormValues {
  reasonType: ReasonType;
  freshman: any | undefined; // should be array (WHY??)
  reason: any | undefined; // required only if reasonType = 0
  quantity: number | undefined; // should be array (WHY??)
  article: any | undefined;
  lot: any | undefined;
  subdivision: any | undefined;
  collocation: any | undefined;
  operatorActivity: any | undefined;
  machineActivity: any | undefined;
  header: any | undefined;
  position: any | undefined;
  phase: any | undefined;
  note: string | undefined;

  freshmanBarcode: string;
  operatorActivityBarcode: string;
  machineActivityBarcode: string;
  articleBarcode: string;
  lotBarcode: string;
  subdivisionBarcode: string;
  collocationBarcode: string;
  headerBarcode: string;
  positionBarcode: string;
  phaseBarcode: string;
}

const validationSchema = Yup.object({
  reasonType: Yup.number().required("Il campo TipoCausale è richiesto"),
  freshman: Yup.mixed().required("Il campo Matricola è richiesto"),
  reason: Yup.mixed().when("reasonType", {
    is: (v: ReasonType) => v.valueOf() === 0,
    then: Yup.mixed().required(
      "Il campo Causale è richiesto se TipoCausale è Specificata"
    ),
    otherwise: Yup.mixed().notRequired(),
  }),
  quantity: Yup.number().required("Il campo Quantità è richiesto"),

  article: Yup.mixed().notRequired(),
  lot: Yup.mixed().notRequired(),
  subdivision: Yup.mixed().notRequired(),
  collocation: Yup.mixed().notRequired(),

  operatorActivity: Yup.mixed().notRequired(),
  machineActivity: Yup.mixed().notRequired(),

  header: Yup.mixed().notRequired(),
  position: Yup.mixed().notRequired(),
  phase: Yup.mixed().notRequired(),

  note: Yup.string().notRequired(),
});

function NewMovementComponent(props: NewMovementProps): React.ReactElement {
  const { route } = props;
  const { reasonTypeDefault } = route.params;

  const { call } = useContext(ApiContext);

  const [initialValues, setInitialValues] = useState<FormValues>({
    reasonType: reasonTypeDefault ?? ReasonTypeKey.Specified,
    freshman: undefined,
    reason: undefined,
    quantity: undefined,
    article: undefined,
    lot: undefined,
    subdivision: undefined,
    collocation: undefined,
    operatorActivity: undefined,
    machineActivity: undefined,
    header: undefined,
    position: undefined,
    phase: undefined,
    note: undefined,

    freshmanBarcode: "",
    operatorActivityBarcode: "",
    machineActivityBarcode: "",
    articleBarcode: "",
    lotBarcode: "",
    subdivisionBarcode: "",
    collocationBarcode: "",
    headerBarcode: "",
    positionBarcode: "",
    phaseBarcode: "",
  });

  const [reasons, setReasons] = useState<Reasons>([]);
  const reasonTypes = [
    { key: ReasonTypeKey.Specified, label: "Specificata" },
    { key: ReasonTypeKey.UnloadProd, label: "Scarico per Produzione" },
    { key: ReasonTypeKey.LoadProd, label: "Carico da Produzione" },
    { key: ReasonTypeKey.LoadRemnant, label: "Carico Avanzo" },
    { key: ReasonTypeKey.LoadScrap, label: "Carico Scarto" },
  ];

  useEffect(() => {
    pipe(
      call(Warehouse.Reason.getCollection)({ settings: makeSettings() }),
      teFold(
        () => tNever,
        (res) => {
          setReasons([{ IdCausale: -1, Codice: "", Descrizione: "" }, ...res]);
          return tOf(res);
        }
      )
    )();
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

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const movement: Warehouse.Movement.NewMovement = makeMovement(
              values
            );

            return pipe(
              call(Warehouse.Movement.create)({
                value: movement,
                settings: makeSettings(),
              }),
              teFold(
                () => {
                  Toast.show(generalErrorToast);
                  return tOf(undefined);
                },
                (res) => {
                  console.log(res);
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
                reason: pipe(
                  reasons,
                  aHead,
                  oFold(
                    () => undefined,
                    (v) => v
                  )
                ),
              });
            }, [reasons]);

            useEffect(() => {
              console.log(values.reason);
            }, [values.reason]);

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
                    Specificare <i>Tipo Causale</i> e <i>Causale</i> se il tipo
                    è &quot;Specificata&quot;
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="actionType"
                      as={Dropdown}
                      items={reasonTypes.map((x) => ({
                        key: x.key,
                        value: x.key,
                        label: x.label,
                      }))}
                      selected={values.reasonType.valueOf()}
                      onSelectedChange={({
                        k,
                      }: {
                        k: ReasonType;
                        v: ReasonType;
                      }) => {
                        setFieldValue("reasonType", k);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <Field
                      name="reason"
                      as={Dropdown}
                      items={reasons.map((reason) => ({
                        key: reason.IdCausale,
                        value: reason,
                        label: `${
                          reason && reason.Codice
                            ? "(".concat(reason.Codice).concat(")")
                            : ""
                        } ${reason.Descrizione}`,
                      }))}
                      selected={values.reason?.IdCausale}
                      onSelectedChange={({ v }: { k: number; v: Reason }) => {
                        pipe(
                          v,
                          O.fromPredicate(not(isPlaceholderReason)),
                          oFold(
                            () => setFieldValue("reason", undefined),
                            (x) => setFieldValue("reason", x)
                          )
                        );
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Specificare una <i>Quantità</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="quantity"
                      as={Input}
                      type="number"
                      placeholder="Qunatità"
                      value={values.quantity}
                      onChangeValue={handleChange("quantity")}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Specificare una <i>Matricola</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="freshman"
                      as={ScanFreshman}
                      placeholder="Matricola"
                      value={values.freshmanBarcode}
                      onChangeValue={handleChange("freshmanBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        console.log(decoded);
                        setFieldValue("freshman", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare delle <i>Note</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="note"
                      as={Textarea}
                      rowSpan={3}
                      bordered
                      placeholder="Note"
                      value={values.note}
                      onChangeValue={handleChange("note")}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare
                    <i>Attività Operatore o Attività Macchina o Entrambe</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="operatorActivity"
                      as={ScanFreshman}
                      placeholder="Attività Operatore"
                      value={values.operatorActivityBarcode}
                      onChangeValue={handleChange("operatorActivityBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("operatorActivity", decoded);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <Field
                      name="machineActivity"
                      as={ScanFreshman}
                      placeholder="Attività Macchina"
                      value={values.machineActivityBarcode}
                      onChangeValue={handleChange("machineActivityBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("machineActivity", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare un <i>Articolo</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="article"
                      as={ScanFreshman}
                      placeholder="Articolo"
                      value={values.articleBarcode}
                      onChangeValue={handleChange("articleBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("article", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare{" "}
                    <i>Lotto e Suddivisione e Collocazione</i>
                  </Text>
                  <View style={styles.item}>
                    <Field
                      name="lot"
                      as={ScanFreshman}
                      placeholder="Lotto"
                      value={values.lotBarcode}
                      onChangeValue={handleChange("lotBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("lot", decoded);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <Field
                      name="subdivision"
                      as={ScanFreshman}
                      placeholder="Suddivisione"
                      value={values.subdivisionBarcode}
                      onChangeValue={handleChange("subdivisionBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("subdivision", decoded);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <Field
                      name="collocation"
                      as={ScanFreshman}
                      placeholder="Collocazione"
                      value={values.collocationBarcode}
                      onChangeValue={handleChange("collocationBarcode")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("collocation", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare l&apos;<i>Ordine Esecutivo</i>,
                    composto da Testata e Posizione e Fase
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

export { NewMovementComponent as NewMovement };

const makeMovement = (values: FormValues): NewMovement => ({
  TipoCausale: values.reasonType,
  IdCausale:
    values.reasonType === ReasonTypeKey.Specified
      ? values.reason.IdCausale
      : undefined,
  Quantita: [values.quantity ? values.quantity : 0],
  Matricole: [values.freshman],
});

const isPlaceholderReason = (x?: Reason) =>
  x ? x.IdCausale === -1 && x.Codice === "" && x.Descrizione === "" : false;

const styles = StyleSheet.create({
  group: { marginTop: "1.5em", width: "100%" },
  groupFirst: { marginTop: "0.5em", width: "100%" },
  item: { marginTop: "0.5em" },
  error: { color: "#ff0" },
});
