import { FormikProps } from "formik";
import React from "react";

import { OperatorActivity } from "../../types/Activity";
import { Operator } from "../../types/Operator";
import { OperatorActivityListFormField } from "./OperatorActivityListFormField";
import { OperatorFormField } from "../FormField";

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
        <OperatorActivityListFormField
          operator={values.operator}
          {...formikProps}
        />
      )}
    </>
  );
};
