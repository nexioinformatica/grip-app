import { Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Subdivision } from "geom-api-ts-client";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import useCancelablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../../stores";
import { DescriptionFormField } from "../../FormField/DescriptionFormField";
import { ShapePickerFormField } from "../../FormField/ShapePickerFormField";
import { SizeValuesFormSection } from "../../FormSection";
import { ErrorSnackbar, SuccessSnackbar } from "../../Snackbar";
import { initialValues, validationSchema } from "./form";
import { makeValues } from "./form/submit";
import { NewSubdivisionFormValues } from "./types";

type Props = {
  freshman?: { IdArticolo: number };
};

export const NewSubdivisionForm = ({ freshman }: Props) => {
  const makeCancelable = useCancelablePromise();
  const { call } = useContext(ApiContext);

  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const handleSubmit = (values: NewSubdivisionFormValues) => {
    // TODO: fix Subdivision.create
    // pipe(makeValues(values), call(Subdivision.create))
  };

  return (
    <View>
      <Formik<NewSubdivisionFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
