import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import useCancelablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../../stores";
import { Shape, Size } from "../../../types/Shape";
import { ErrorSnackbar, SuccessSnackbar } from "../../Snackbar";
import { initialValues, validationSchema } from "./form";
import { NewSubdivisionFormValues } from "./types";
import { pipe } from "fp-ts/lib/pipeable";
import { TextInput } from "../../TextInput";
import { SizeValuesFormSection } from "../../FormSection";
import { ShapePickerFormField } from "../../FormField/ShapePickerFormField";
import { DescriptionFormField } from "../../FormField/DescriptionFormField";

type Props = {
  freshman?: { IdArticolo: number };
};

export const NewSubdivisionForm = ({ freshman }: Props) => {
  const makeCancelable = useCancelablePromise();
  const { call } = useContext(ApiContext);

  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const handleSubmit = (values: NewSubdivisionFormValues) => {
    pipe(values);
  };

  return (
    <View>
      <Formik<NewSubdivisionFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {(formikProps) => {
          const {
            isSubmitting,
            isValid,
            values,
            handleReset,
            handleSubmit,
          } = formikProps;
          return (
            <View>
              {freshman && (
                <ShapePickerFormField freshman={freshman} {...formikProps} />
              )}

              {values.shape && (
                <>
                  <DescriptionFormField {...formikProps} />

                  <SizeValuesFormSection
                    sizes={values.shape.Dimensioni}
                    {...formikProps}
                  />
                </>
              )}

              <View style={styles.mt16}>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                >
                  Crea suddivisione
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleReset}
                  style={styles.mt8}
                >
                  Reset
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>

      <SuccessSnackbar isSuccess={isSuccess} setSuccess={setSuccess} />
      <ErrorSnackbar isError={isError} setError={setError} />
    </View>
  );
};

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
  mt8: { marginTop: 8 },
});
