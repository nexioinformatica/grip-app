import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Operator } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores";

import {
  Operator as OperatorT,
  OperatorItemAdapterFactory,
} from "../../types/Operator";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { TextInput, TextInputFail } from "../TextInput";

interface OperatorFormValues {
  operator?: OperatorT;
}

const operatorItemAdapterFactory = new OperatorItemAdapterFactory();

export const OperatorFormField = <T extends OperatorFormValues>({
  setFieldValue,
  handleBlur,
  values,
  errors,
}: FormikProps<T>): React.ReactElement => {
  const makeCancelable = useCancellablePromise();
  const { call } = useContext(ApiContext);

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getMe = () => {
    setLoading(true);
    setError(false);
    makeCancelable(
      pipe(
        call(Operator.getMe)({
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then((operator) => {
          setFieldValue("operator", operator);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false))
    );
  };

  useEffect(() => {
    getMe();
  }, []);

  if (isError)
    return <TextInputFail label="Operatore*" retry={() => getMe()} />;

  if (isLoading) return <ActivityIndicator />;

  return (
    <>
      <TextInput
        label="Operatore*"
        value={
          values.operator
            ? operatorItemAdapterFactory.fromSingle(values.operator).title
            : ""
        }
        onBlur={handleBlur("operator")}
        error={!!errors.operator}
        errorText={errors.operator?.toString()}
        editable={false}
      />
    </>
  );
};
