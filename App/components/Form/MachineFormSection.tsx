import React from "react";
import { FormikProps } from "formik";
import { ScanFreshman } from "../ScanInput";

type MachineFormValues = {
  machine?: { IdMacchina: number };
  barcode: {
    machine: string;
  };
};

export const MachineFormSection = <T extends MachineFormValues>({
  handleChange,
  setFieldValue,
  values,
  handleBlur,
  errors,
}: FormikProps<T>): React.ReactElement => {
  return (
    <ScanFreshman
      label="Macchina*"
      onChangeText={(x?: string) => handleChange("barcode.machine")(x ?? "")}
      onDecodeValue={(x) => setFieldValue("machine", x[0].Id.IdMacchina)}
      value={values.barcode.machine}
      returnKeyType="next"
      onBlur={handleBlur("machine")}
      error={!!errors.machine}
      errorText={errors.machine?.toString()}
      keyboardType="default"
    />
  );
};
