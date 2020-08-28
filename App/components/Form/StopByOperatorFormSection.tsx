import { FormikProps } from "formik";
import React from "react";

import { OperatorActivity } from "../../types/Activity";
import { Operator } from "../../types/Operator";
import {
  OperatorFormField,
  OperatorActivityPickerFormField,
} from "../FormField";

interface StopByOperatorFormValues {
  operator?: Operator;
  operatorActivity?: OperatorActivity;
}

export const StopByOperatorFormSection = <T extends StopByOperatorFormValues>({
  ...formikProps
}: FormikProps<T>): React.ReactElement => {
  const { values } = formikProps;
  return (
    <>
      <OperatorFormField {...formikProps} />
      {values.operator && (
        <OperatorActivityPickerFormField
          operator={values.operator}
          {...formikProps}
        />
      )}
    </>
  );
};
