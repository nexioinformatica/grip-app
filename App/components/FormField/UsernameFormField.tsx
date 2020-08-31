import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Operator as OperatorApi } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores";
import {
  Operator,
  UsernameOperatorItemAdapterFactory,
} from "../../types/Operator";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { IconTextInputPicker } from "../Dropdown";
import { TextInputFail } from "../TextInput";

interface UsernameFormValues {
  username: string;
}

export const UsernameFormField = <T extends UsernameFormValues>({
  values,
  handleChange,
  handleBlur,
  errors,
}: FormikProps<T>): React.ReactElement => {
  const makeCancelable = useCancellablePromise();
  const { callPublic } = useContext(ApiContext);

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [operators, setOperators] = useState<Operator[]>([]);

  const adapter = new UsernameOperatorItemAdapterFactory();

  const getOperators = () => {
    setLoading(false);
    setError(false);
    makeCancelable(
      pipe(
        callPublic(OperatorApi.getCollection)({
          query: {
            params: { AbilitatoAPI: true, AbilitatoAttivitaReparto: true },
          },
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then((operators) => {
          setOperators(operators);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false))
    );
  };

  useEffect(() => {
    getOperators();
  }, []);

  if (isError)
    return <TextInputFail label="Username*" retry={() => getOperators()} />;

  if (isLoading) return <ActivityIndicator />;

  return (
    <IconTextInputPicker
      label="Username"
      returnKeyType="next"
      value={values.username}
      onChangeText={handleChange("username")}
      onBlur={handleBlur("username")}
      error={!!errors.username}
      errorText={errors.username?.toString()}
      autoCapitalize="none"
      autoCompleteType="username"
      textContentType="username"
      keyboardType="default"
      items={adapter.fromCollection(operators)}
      rightIcon="account-circle"
    />
  );
};
