import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "geom-api-ts-client";
import React from "react";

import { ScanFreshman } from "../ScanInput";

interface PhaseFormValues {
  phase?: { IdFase: number };

  barcode: {
    phase: string;
  };
}

export const PhaseFormField = <T extends PhaseFormValues>({
  handleChange,
  setFieldValue,
  handleBlur,
  values,
  errors,
}: FormikProps<T>): React.ReactElement => {
  return (
    <ScanFreshman
      label="Fase"
      onChangeText={(x?: string) => handleChange("barcode.phase")(x ?? "")}
      onDecodeValue={(x) =>
        setFieldValue(
          "phase",
          pipe(x, Barcode.Util.getDecode<Barcode.PhaseDecode>("F"))
        )
      }
      value={values.barcode.phase}
      returnKeyType="next"
      onBlur={handleBlur("phase")}
      error={!!errors.phase}
      errorText={errors.phase?.toString()}
      keyboardType="default"
    />
  );
};
