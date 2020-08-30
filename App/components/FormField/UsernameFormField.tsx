import React, { useContext, useState, useEffect } from "react";
import { FormikProps } from "formik";
import { IconTextInputPicker } from "../Dropdown";
import useCancellablePromise from "@rodw95/use-cancelable-promise";
import { ApiContext } from "../../stores";
import { Operator } from "../../types/Operator";
import { pipe } from "fp-ts/lib/pipeable";
import { Operator as OperatorApi } from "geom-api-ts-client";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { TextInputFail } from "../TextInput";
import { ActivityIndicator } from "react-native-paper";

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

  // const handleSelected = (x: Operator) => onSelectedValue(x);
  const operatorItemAdapterFactory = new OperatorItemAdapterFactory();

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
      items={operatorItemAdapterFactory.fromCollection(operators)}
      rightIcon="account-circle"
    />
  );
};

export class OperatorItemAdapterFactory {
  fromSingle(single: Operator) {
    return {
      key: single.IdOperatore.toString(),
      title: `${single.Nome}`,
      description: `${single.UserName}`,
      value: single.UserName ?? "",
    };
  }

  fromCollection(collection: Operator[]) {
    return collection.map((x) => this.fromSingle(x));
  }
}
