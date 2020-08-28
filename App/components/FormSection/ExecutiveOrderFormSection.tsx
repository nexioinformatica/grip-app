import { FormikProps } from "formik";
import React from "react";

import {
  PhaseFormField,
  PositionFormField,
  HeaderFormField,
} from "../FormField";

interface ExecutiveOrder {
  phase?: { IdFase: number };
  position?: { IdPosizione: number };
  header?: { IdTestata: number };

  barcode: {
    phase: string;
    position: string;
    header: string;
  };
}

export const ExecutiveOrderFormSection = <T extends ExecutiveOrder>(
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
