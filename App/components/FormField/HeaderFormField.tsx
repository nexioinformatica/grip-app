import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "geom-api-ts-client";
import React from "react";

import { ScanCode } from "../ScanInput";

interface HeaderFormValues {
  header?: Barcode.HeaderDecode;

  barcode: {
    header: string;
  };
}

export const HeaderFormField = <T extends HeaderFormValues>(
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
    <ScanCode
      label="Testata"
      onChangeText={(x?: string) => handleChange("barcode.header")(x ?? "")}
      onDecodeValue={(x) =>
        setFieldValue(
          "header",
          pipe(x, Barcode.Util.getDecode<Barcode.HeaderDecode>("T"))
        )
      }
      value={values.barcode.header}
      returnKeyType="next"
      onBlur={handleBlur("header")}
      error={!!errors.header}
      errorText={errors.header?.toString()}
      keyboardType="default"
    />
  );
};
