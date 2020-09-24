import { FormikProps } from "formik";
import React from "react";
import { TextInput } from "../TextInput";

type DescriptionFormValues = {
  description?: string;
};

type Props<T> = FormikProps<T>;

export const DescriptionFormField = <T extends DescriptionFormValues>({
  handleBlur,
  handleChange,
  errors,
  values,
}: Props<T>): React.ReactElement => (
  <TextInput
    label="Descrizione"
    onChangeText={(x?: string) => handleChange("description")(x ?? "")}
    value={values.description}
    returnKeyType="next"
    onBlur={handleBlur("description")}
    error={!!errors.description}
    errorText={errors.description?.toString()}
    keyboardType="default"
  />
);
