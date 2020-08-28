import { Formik } from "formik";
import { Barcode, Warehouse } from "geom-api-ts-client";
import React, { useState, useContext, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Caption, Card, Snackbar, Title } from "react-native-paper";
import * as Yup from "yup";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { ScanFreshman, TextInputPicker } from "../../../components";
import {
  getReasonTypeName,
  ReasonType,
  isRequiringReason,
} from "../../../types/ReasonType";
import { MovementsStackParamList } from "../Stacks";
import useCancellablePromise from "@rodw95/use-cancelable-promise";
import { pipe } from "fp-ts/lib/pipeable";
import { ApiContext } from "../../../stores";
import { makeSettings } from "../../../util/api";
import { toResultTask } from "../../../util/fp";
import {
  Reason,
  Reasons,
  ReasonItemsAdapterFactory,
} from "../../../types/Reason";

type Props = {
  navigation: StackNavigationProp<MovementsStackParamList, "NewMovement">;
  route: RouteProp<MovementsStackParamList, "NewMovement">;
};

interface FormValues {
  freshman: Barcode.BarcodeDecode | undefined;
  reason: ReasonType | undefined;
  reasonTitle: string;
  freshmanBarcode: string;
}

const initialValues: FormValues = {
  freshman: undefined,
  reason: undefined,
  reasonTitle: "",
  freshmanBarcode: "",
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

const NewMovement = (props: Props): React.ReactElement => {
  const {
    route: {
      params: { reasonType },
    },
  } = props;
  const makeCancelable = useCancellablePromise();
  const { call } = useContext(ApiContext);
  const [isError, setError] = useState(false);
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
              <Title>Nuovo Movimento</Title>
              <Caption>{getReasonTypeName(reasonType)}</Caption>

              <View style={styles.mt16}>
                <Formik<FormValues>
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={validationSchema(reasonType)}
                  onSubmit={handleSubmit}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    errors,
                    isSubmitting,
                    isValid,
                    setFieldValue,
                    values,
                    resetForm,
                  }) => {
                    return (
                      <>
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

                        <ScanFreshman
                          label="Matricola"
                          onChangeText={(x?: string) =>
                            handleChange("freshmanBarcode")(x ?? "")
                          }
                          onDecodeValue={(x) =>
                            setFieldValue(
                              "freshman",
                              pipe(
                                x,
                                Barcode.Util.getDecode<Barcode.FreshmanDecode>(
                                  "R"
                                )
                              )
                            )
                          }
                          value={values.freshmanBarcode}
                          returnKeyType="next"
                          onBlur={handleBlur("freshman")}
                          error={!!errors.freshman}
                          errorText={errors.freshman}
                          keyboardType="default"
                        />

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

const NewMovementMemo = React.memo(NewMovement);

export { NewMovementMemo as NewMovement };

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
});
