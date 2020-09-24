import { FormikProps } from "formik";
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

type Props<T> = FormikProps<T> & React.ComponentProps<typeof Button>;

export const SendButton = <T,>({
  isSubmitting,
  isValid,
  handleSubmit,
  children,
  ...rest
}: Props<T>): React.ReactElement => (
  <Button
    mode="contained"
    style={styles.mt16}
    disabled={!isValid || isSubmitting}
    loading={isSubmitting}
    onPress={handleSubmit}
    {...rest}
  >
    {children}
  </Button>
);

const styles = StyleSheet.create({
  mt16: { marginTop: 16 },
});
