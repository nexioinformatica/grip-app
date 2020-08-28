import { FormikProps } from "formik";
import React from "react";

import { MachineActivity } from "../../types/Activity";
import { Machine } from "../../types/Machine";
import {
  MachineActivityPickerFormField,
  MachineFormField,
  MachinePickerFormField,
} from "../FormField";

interface StopByMachineFormValues {
  machine?: Machine;
  machineActivity?: MachineActivity;
  barcode: {
    machine: string;
  };
}

export const StopByMachineFormSection = <T extends StopByMachineFormValues>({
  isMachineReadFromBarcode,
  ...formikProps
}: FormikProps<T> & {
  isMachineReadFromBarcode: boolean;
}): React.ReactElement => {
  const { values } = formikProps;
  return (
    <>
      {isMachineReadFromBarcode ? (
        <MachineFormField {...formikProps} />
      ) : (
        <MachinePickerFormField {...formikProps} />
      )}
      {values.machine && (
        <MachineActivityPickerFormField
          machine={values.machine}
          {...formikProps}
        />
      )}
    </>
  );
};
