import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "geom-api-ts-client";
import React from "react";

import { ScanFreshman } from "../ScanInput";

interface PositionFormValues {
  position?: { IdPosizione: number };

  barcode: {
    position: string;
  };
}

export const PositionFormField = <T extends PositionFormValues>(
  formikProps: FormikProps<T>
): React.ReactElement => {
  const {
    handleChange,
    setFieldValue,
    handleBlur,
    values,
    errors,
  } = formikProps;
  return (
    <ScanFreshman
      label="Posizione"
      onChangeText={(x?: string) => handleChange("barcode.position")(x ?? "")}
      onDecodeValue={(x) =>
        setFieldValue(
          "position",
          pipe(x, Barcode.Util.getDecode<Barcode.PositionDecode>("P"))
        )
      }
      value={values.barcode.position}
      returnKeyType="next"
      onBlur={handleBlur("position")}
      error={!!errors.position}
      errorText={errors.position?.toString()}
      keyboardType="default"
    />
  );
};
