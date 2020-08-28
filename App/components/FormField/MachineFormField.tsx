import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "geom-api-ts-client";
import React from "react";

import { ScanFreshman } from "../ScanInput";

type MachineFormValues = {
  machine?: { IdMacchina: number };
  barcode: {
    machine: string;
  };
};

export const MachineFormField = <T extends MachineFormValues>({
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
      onDecodeValue={(x) =>
        setFieldValue(
          "machine",
          pipe(x, Barcode.Util.getDecode<Barcode.MachineDecode>("M"))?.Oggetto
        )
      }
      value={values.barcode.machine}
      returnKeyType="next"
      onBlur={handleBlur("machine")}
      error={!!errors.machine}
      errorText={errors.machine?.toString()}
      keyboardType="default"
    />
  );
};
