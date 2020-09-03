import { Formik } from "formik";
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
  freshman: Barcode.BarcodeDecode | undefined; // should be array (WHY??)
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
  quantity: Yup.number()
    .integer("Il campo deve essere un numero")
    .required("Il campo Quantità è richiesto"),

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
          setReasons([
            { IdCausale: -1, Codice: "", Descrizione: "Non specificata" },
            ...res,
          ]);
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
            const newMovement: Warehouse.Movement.NewMovement = makeNewMovement(
              values
            );

            return pipe(
              call(Warehouse.Movement.create)({
                value: newMovement,
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

            return (
              <>
                {!isValid && (
                  <View style={{ ...styles.groupFirst }}>
                    {Object.values(errors).map((x, i) => (
                      <Text key={i} style={styles.textError}>
                        {x}
                      </Text>
                    ))}
                  </View>
                )}
                <View style={isValid ? styles.group : styles.groupFirst}>
                  <Text>
                    Specificare Tipo Causale e Causale se il tipo è
                    &quot;Specificata&quot;
                  </Text>
                  <View style={styles.item}>
                    <Dropdown<ReasonType>
                      items={reasonTypes.map((x) => ({
                        key: x.key,
                        value: x.key,
                        label: x.label,
                      }))}
                      selected={values.reasonType.valueOf()}
                      onSelectedChange={({ k }) => {
                        setFieldValue("reasonType", k);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <Dropdown<Reason>
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
                      placeholder="Select"
                      onSelectedChange={({ v }) => {
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
                  <Text>Specificare una Quantità</Text>
                  <View style={styles.item}>
                    <Input
                      keyboardType="numeric"
                      placeholder="Quantità"
                      value={values.quantity?.toString()}
                      onChangeText={handleChange("quantity")}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>Specificare una Matricola</Text>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Matricola"
                      value={values.freshmanBarcode}
                      onChangeValue={(v) =>
                        handleChange("freshmanBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("freshman", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>Opzionalmente, specificare delle Note</Text>
                  <View style={styles.item}>
                    <Textarea
                      underline={false}
                      rowSpan={3}
                      bordered
                      placeholder="Note"
                      value={values.note}
                      onChangeText={handleChange("note")}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare Attività Operatore o Attività
                    Macchina o Entrambe
                  </Text>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Attività Operatore"
                      value={values.operatorActivityBarcode}
                      onChangeValue={(v) =>
                        handleChange("operatorActivityBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("operatorActivity", decoded);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Attività Macchina"
                      value={values.machineActivityBarcode}
                      onChangeValue={(v) =>
                        handleChange("machineActivityBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("machineActivity", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>Opzionalmente, specificare un Articolo</Text>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Articolo"
                      value={values.articleBarcode}
                      onChangeValue={(v) =>
                        handleChange("articleBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("article", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare Lotto e Suddivisione e
                    Collocazione
                  </Text>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Lotto"
                      value={values.lotBarcode}
                      onChangeValue={(v) => handleChange("lotBarcode")(v ?? "")}
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("lot", decoded);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Suddivisione"
                      value={values.subdivisionBarcode}
                      onChangeValue={(v) =>
                        handleChange("subdivisionBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("subdivision", decoded);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Collocazione"
                      value={values.collocationBarcode}
                      onChangeValue={(v) =>
                        handleChange("collocationBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("collocation", decoded);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.group}>
                  <Text>
                    Opzionalmente, specificare l&apos;Ordine Esecutivo, composto
                    da Testata e Posizione e Fase
                  </Text>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Testata"
                      value={values.headerBarcode}
                      onChangeValue={(v) =>
                        handleChange("headerBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("header", decoded);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Posizione"
                      value={values.positionBarcode}
                      onChangeValue={(v) =>
                        handleChange("positionBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
                        setFieldValue("position", decoded);
                      }}
                    />
                  </View>
                  <View style={styles.item}>
                    <ScanFreshman
                      placeholder="Fase"
                      value={values.phaseBarcode}
                      onChangeValue={(v) =>
                        handleChange("phaseBarcode")(v ?? "")
                      }
                      onDecodeValue={(decoded: Barcode.BarcodeDecode) => {
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
                      disabled={!isValid || isSubmitting}
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

const makeNewMovement = (values: FormValues): NewMovement => ({
  TipoCausale: values.reasonType,
  IdCausale:
    values.reasonType === ReasonTypeKey.Specified
      ? values.reason.IdCausale
      : undefined,
  Quantita: [values.quantity ? values.quantity : 0],
  Matricole: [values.freshman ? values.freshman[0].Id : 0],
});

const isPlaceholderReason = (x?: Reason) =>
  x ? x.IdCausale === -1 && x.Codice === "" && x.Descrizione === "" : false;

const styles = StyleSheet.create({
  group: { marginTop: 15, width: "100%" },
  groupFirst: { marginTop: 5, width: "100%" },
  item: { marginTop: 5 },
  textError: { color: "#f00" },
});
