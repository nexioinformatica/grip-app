import React from "react";
import { FormikProps } from "formik";
import { ScanFreshman } from "../ScanInput";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "geom-api-ts-client";

interface FreshmanFormValues {
  freshman?: Barcode.FreshmanDecode;
  barcode: {
    freshman: string;
  };
}

type ScanFreshmanProps = Partial<React.ComponentProps<typeof ScanFreshman>>;

export const FreshmanFormField = <T extends FreshmanFormValues>({
  handleChange,
  setFieldValue,
  values,
  handleBlur,
  errors,
  ...rest
}: FormikProps<T> & ScanFreshmanProps): React.ReactElement => (
  <ScanFreshman
    label="Matricola"
    onChangeText={(x?: string) => handleChange("barcode.freshman")(x ?? "")}
    onDecodeValue={(x) =>
      setFieldValue(
        "freshman",
        pipe(x, Barcode.Util.getDecode<Barcode.FreshmanDecode>("R"))
      )
    }
    value={values.barcode.freshman}
    returnKeyType="next"
    onBlur={handleBlur("freshman")}
    error={!!errors.freshman}
    errorText={errors.freshman?.toString()}
    keyboardType="default"
    {...rest}
  />
);
