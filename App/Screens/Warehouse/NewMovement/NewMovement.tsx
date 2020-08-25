import { Formik } from "formik";
import { Barcode } from "geom-api-ts-client";
import React, { memo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Caption, Card, Snackbar, Title } from "react-native-paper";
import * as Yup from "yup";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { ScanFreshman } from "../../../components";
import { getReasonTypeName } from "../../../types/ReasonType";
import { MovementsStackParamList } from "../Stacks";

type Props = {
  navigation: StackNavigationProp<MovementsStackParamList, "NewMovement">;
  route: RouteProp<MovementsStackParamList, "NewMovement">;
};

interface FormValues {
  freshman: Barcode.BarcodeDecode | undefined;

  freshmanBarcode: string;
}

const initialValues: FormValues = {
  freshman: undefined,
  freshmanBarcode: "",
};

const validationSchema = Yup.object({
  freshman: Yup.mixed().required("Il campo Matricola è richiesto"),
});

export const NewMovement = memo((props: Props) => {
  const {
    route: {
      params: { reasonType },
    },
  } = props;
  const [isError, setError] = useState(false);

  const handleSubmit = (values: FormValues) => {
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
});

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  divider: { width: "100%", marginTop: 16, height: 2 },
  mt16: { marginTop: 16 },
});
