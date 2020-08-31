import { FormikProps } from "formik";
import { Barcode } from "geom-api-ts-client";
import React from "react";

import {
  HeaderFormField,
  PhaseFormField,
  PositionFormField,
} from "../FormField";

interface ExecutiveOrderFormValues {
  phase?: Barcode.PhaseDecode;
  position?: Barcode.PositionDecode;
  header?: Barcode.HeaderDecode;

  barcode: {
    phase: string;
    position: string;
    header: string;
  };
}

export const ExecutiveOrderFormSection = <T extends ExecutiveOrderFormValues>(
  formikProps: FormikProps<T>
): React.ReactElement => {
  return (
    <>
      <PhaseFormField {...formikProps} />
      <PositionFormField {...formikProps} />
      <HeaderFormField {...formikProps} />
    </>
  );
};
