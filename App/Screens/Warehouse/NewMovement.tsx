import React, { useContext, useEffect, useState, memo } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Card, Title, Button, Snackbar } from "react-native-paper";
import { ScanFreshman } from "../../components";
import { Formik } from "formik";
import { Barcode } from "geom-api-ts-client";
import * as Yup from "yup";

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

export const NewMovement = memo(() => {
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
