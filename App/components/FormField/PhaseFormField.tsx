import { FormikProps } from "formik";
import { Barcode, Job } from "geom-api-ts-client";
import React from "react";

import { ScanPhase } from "../ScanInput";

interface PhaseFormValues {
  phase?: Job.Job;

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
    <ScanPhase
      label="Fase"
      onChangeText={(x?: string) => handleChange("barcode.phase")(x ?? "")}
      onDecodeValue={(x) => setFieldValue("phase", x)}
      value={values.barcode.phase}
      returnKeyType="next"
      onBlur={handleBlur("phase")}
      error={!!errors.phase}
      errorText={errors.phase?.toString()}
      keyboardType="default"
    />
  );
};
