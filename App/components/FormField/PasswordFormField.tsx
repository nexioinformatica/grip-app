import React from "react";
import { FormikProps } from "formik";
import { TextInput } from "../TextInput";

interface PasswordFormValues {
  password: string;
}

export const PasswordFormField = <T extends PasswordFormValues>({
  values,
  handleChange,
  handleBlur,
  errors,
}: FormikProps<T>): React.ReactElement => (
  <TextInput
    label="Password"
    returnKeyType="done"
    value={values.password}
    onChangeText={handleChange("password")}
    onBlur={handleBlur("password")}
    error={!!errors.password}
    errorText={errors.password?.toString()}
    secureTextEntry
  />
);
