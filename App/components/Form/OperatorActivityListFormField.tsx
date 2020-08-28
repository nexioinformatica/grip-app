import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Activities } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores";
import {
  OperatorActivity,
  OperatorActivityItemAdapterFactory,
  OperatorActivityList,
} from "../../types/Activity";
import { ListItem } from "../../types/Item";
import { Operator } from "../../types/Operator";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { noop } from "../../util/noop";
import { TextInputPicker } from "../Dropdown";
import { TextInputFail } from "../TextInput";

interface OperatorActivityListFormValues {
  operatorActivity?: OperatorActivity;
}

const operatorActivityItemAdapterFactory = new OperatorActivityItemAdapterFactory();

export const OperatorActivityListFormField = <
  T extends OperatorActivityListFormValues
>({
  operator,
  setFieldValue,
  handleBlur,
  values,
  errors,
}: FormikProps<T> & { operator?: Operator }): React.ReactElement => {
  const makeCancelable = useCancellablePromise();
  const { call } = useContext(ApiContext);

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const [operatorActivityList, setOperatorActivityList] = useState<
    OperatorActivityList
  >([]);

  const getOperatorActivityList = (IdOperatore: number) => {
    setLoading(true);
    setError(false);
    makeCancelable(
      pipe(
        call(Activities.collectionByOperator)({
          IdOperatore: IdOperatore,
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then((activityList) => {
          setOperatorActivityList(activityList);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false))
    );
  };

  if (!operator)
    return (
      <TextInputFail
        label="Attività Operatore*"
        errorText="Specificare un operatore per caricare la relativa lista di attività"
        retry={noop}
      />
    );

  useEffect(() => {
    getOperatorActivityList(operator.IdOperatore);
  }, [operator]);

  if (isError)
    return (
      <TextInputFail
        label="Attività Operatore*"
        retry={() => getOperatorActivityList(operator.IdOperatore)}
      />
    );

  if (isLoading) return <ActivityIndicator />;

  return (
    <>
      <TextInputPicker
        label="Attività Operatore*"
        items={operatorActivityItemAdapterFactory.fromCollection(
          operatorActivityList
        )}
        value={
          values.operatorActivity
            ? operatorActivityItemAdapterFactory.fromSingle(
                values.operatorActivity
              ).title
            : ""
        }
        onValueChange={(x: ListItem<OperatorActivity>) => {
          setFieldValue("operatorActivity", x.value);
        }}
        onBlur={handleBlur("operatorActivity")}
        error={!!errors.operatorActivity}
        errorText={errors.operatorActivity?.toString()}
      />
    </>
  );
};
