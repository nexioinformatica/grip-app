import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Formik } from "formik";
import { Button, Portal, Dialog, Text } from "react-native-paper";
import { FlatSurface } from "../Surface";
import { ScrollView } from "react-native";
import { TextInput } from "../TextInput";
import { Snackbar } from "../Snackbar";
import * as Yup from "yup";

interface NewSubdivisionFormValues {
  height?: number;
  width?: number;
}

const validationScema = Yup.object({
  height: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Il campo Altezza deve essere maggiore o uguale a zero")
    .required("Il campo Altezza è richiesto"),
  width: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Il campo Altezza deve essere maggiore o uguale a zero")
    .required("Il campo Larghezza è richiesto"),
});

const initialValues = {
  height: undefined,
  width: undefined,
};

export const NewSubdivisionFormField = (): React.ReactElement => {
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(true);

  const [isVisible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <>
      <Button mode="outlined" onPress={showDialog}>
        Nuova suddivisione
      </Button>
      <Portal>
        <Dialog visible={isVisible}>
          <FlatSurface>
            <Dialog.Title>Nuova Suddivisione</Dialog.Title>
            <Dialog.Content>
              <ScrollView>
                <Formik<NewSubdivisionFormValues>
                  initialValues={initialValues}
                  validationSchema={validationScema}
                  onSubmit={(values) => {
                    console.log(values);
                    return Promise.reject("TODO")
                      .then(() => setSuccess(true))
                      .catch(() => {
                        setError(true);
                      });
                  }}
                >
                  {({
                    handleSubmit,
                    isValid,
                    isSubmitting,
                    handleChange,
                    errors,
                  }) => (
                    <>
                      <TextInput
                        label="Altezza*"
                        onChangeText={handleChange("height")}
                        error={!!errors.height}
                        errorText={errors.height?.toString()}
                        // textContentType=""
                        keyboardType="numeric"
                        returnKeyType="next"
                      />
                      <TextInput
                        label="Larghezza*"
                        onChangeText={handleChange("width")}
                        error={!!errors.width}
                        errorText={errors.width?.toString()}
                        keyboardType="numeric"
                        returnKeyType="done"
                      />

                      <FlatSurface style={styles.mt16}>
                        <Button
                          mode="contained"
                          onPress={handleSubmit}
                          disabled={!isValid || isSubmitting}
                          loading={isSubmitting}
                        >
                          Crea
                        </Button>
                        <Button
                          mode="outlined"
                          onPress={hideDialog}
                          style={styles.mt8}
                        >
                          Chiudi
                        </Button>
                      </FlatSurface>
                    </>
                  )}
                </Formik>
              </ScrollView>
            </Dialog.Content>
          </FlatSurface>
        </Dialog>
        <Snackbar
          visible={isError}
          onDismiss={() => {
            setError(false);
          }}
          duration={3000}
        >
          <Text>Coff coff, qualcosa è andato storto</Text>
        </Snackbar>
        <Snackbar
          visible={isSuccess}
          onDismiss={() => {
            setSuccess(false);
          }}
          duration={3000}
        >
          <Text>Operazione effettuata con successo</Text>
        </Snackbar>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
  mt8: { marginTop: 8 },
});
