import { FormikProps } from "formik";
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

type Props<T> = FormikProps<T> & React.ComponentProps<typeof Button>;

export const ResetButton = <T,>({
  isSubmitting,
  resetForm,
  children,
  ...rest
}: Props<T>): React.ReactElement => (
  <Button
    mode="text"
    disabled={isSubmitting}
    onPress={resetForm}
    style={styles.mt16}
    {...rest}
  >
    {children}
  </Button>
);

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
});
