import { FormikProps } from "formik";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import React from "react";

import {
  Size as SizeT,
  SizeItemAdapterFactory,
  SizeValue,
} from "../../types/Shape";
import { TextInput } from "../TextInput";

type SizeFormValues = {
  sizeValues: SizeValue[];
};

type Props<T> = FormikProps<T> & { size: SizeT };

const setNewSizeValue = (sizes: SizeValue[]) => (size: SizeT) => (
  value: number
): SizeValue[] => [
  ...pipe(
    sizes,
    A.filter((x) => x.Sigla != size.Sigla)
  ),
  { Sigla: size.Sigla, Valore: value },
];

export const SizeFormField = <T extends SizeFormValues>({
  size,
  values,
  errors,
  setFieldValue,
}: Props<T>) => {
  const adapter = new SizeItemAdapterFactory();

  const handleChangeText = (v: string) =>
    setFieldValue(
      "sizes",
      pipe(v, Number.parseInt, setNewSizeValue(values.sizeValues)(size))
    );

  return (
    <TextInput
      label={adapter.fromSingle(size).title}
      onChangeText={handleChangeText}
      error={!!errors.sizeValues}
      keyboardType="numeric"
      returnKeyType="next"
    />
  );
};
