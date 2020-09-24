import { FormikProps } from "formik";
import React from "react";
import { Size, SizeValue } from "../../types/Shape";
import { SizeFormField } from "../FormField";

type SizeValuesFormValues = {
  sizeValues: SizeValue[];
};

type Props<T> = FormikProps<T> & {
  sizes: Size[];
};

export const SizeValuesFormSection = <T extends SizeValuesFormValues>({
  sizes,
  ...formikProps
}: Props<T>) => {
  return (
    <>
      {sizes.map((s, i) => {
        return <SizeFormField<T> key={i} size={s} {...formikProps} />;
      })}
    </>
  );
};
