import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Card, Title, Button, Snackbar, Caption } from "react-native-paper";
import { ScanFreshman } from "../../../components";
import { Formik } from "formik";
import { Barcode } from "geom-api-ts-client";
import * as Yup from "yup";
import { StackNavigationProp } from "@react-navigation/stack";
import { ActivitiesStackParamList } from "../Stacks";
import { RouteProp } from "@react-navigation/native";
import {
  getActionTypeName,
  ActionType,
  isRequiringMachine,
} from "../../../types/ActionType";

type Props = {
  navigation: StackNavigationProp<ActivitiesStackParamList, "StartActivity">;
  route: RouteProp<ActivitiesStackParamList, "StartActivity">;
};

interface FormValues {
  freshman: Barcode.BarcodeDecode | undefined;
  machine: Barcode.BarcodeDecode | undefined;

  freshmanBarcode: string;
  machineBarcode: string;
}

const initialValues: FormValues = {
  freshman: undefined,
  machine: undefined,
  freshmanBarcode: "",
  machineBarcode: "",
};

const validationSchema = (actionType: ActionType) => {
  const machine = isRequiringMachine(actionType)
    ? {
        machine: Yup.mixed().required("Il campo Macchina è richiesto"),
      }
    : {};
  return Yup.object({
    freshman: Yup.mixed().required("Il campo Matricola è richiesto"),
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
                  validationSchema={validationSchema}
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
                        <ScanFreshman
                          label="Matricola"
                          onChangeText={(x?: string) =>
                            handleChange("freshmanBarcode")(x ?? "")
                          }
                          onDecodeValue={(x) => setFieldValue("freshman", x[0])}
                          value={values.freshmanBarcode}
                          returnKeyType="next"
                          onBlur={handleBlur("freshman")}
                          error={!!errors.freshman}
                          errorText={errors.freshman}
                          keyboardType="default"
                        />

                        {isRequiringMachine(actionType) && (
                          <ScanFreshman
                            label="Macchina"
                            onChangeText={(x?: string) =>
                              handleChange("machineBarcode")(x ?? "")
                            }
                            onDecodeValue={(x) =>
                              setFieldValue("machine", x[0])
                            }
                            value={values.machineBarcode}
                            returnKeyType="next"
                            onBlur={handleBlur("machine")}
                            error={!!errors.machine}
                            errorText={errors.machine}
                            keyboardType="default"
                          />
                        )}

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
