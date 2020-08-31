import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Subdivision } from "geom-api-ts-client";
import React, { useContext, useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";

import useCancelablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { TextInputPicker } from "../Dropdown";
import { noop } from "../../util/noop";
import { TextInputFail } from "../TextInput";
import { ActivityIndicator } from "react-native-paper";
import { SubdivisionItemAdapterFactory } from "../../types/Subdivision";
import { ListItem } from "../../types/Item";

interface SubdivisionFormValues {
  subdivision?: Subdivision.Subdivision;
}

export const SubdivisionFormField = <T extends SubdivisionFormValues>({
  freshman,
  values,
  handleBlur,
  errors,
  setFieldValue,
}: FormikProps<T> & {
  freshman?: { IdMatricola: number };
}): React.ReactElement => {
  const makeCancelable = useCancelablePromise();
  const { call } = useContext(ApiContext);

  const [subdivisions, setSubdivisions] = useState<Subdivision.Collection>([]);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const getSubdivisions = (freshmanId: number) => {
    setLoading(false);
    setError(false);
    return makeCancelable(
      pipe(
        call(Subdivision.collectionByFreshman)({
          IdMatricola: freshmanId,
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then(setSubdivisions)
        .catch()
    );
  };

  if (!freshman) {
    return (
      <TextInputFail
        label="Suddivisione*"
        errorText="Specificare una matricola per caricare la relativa lista di suddivisioni"
        retry={noop}
      />
    );
  }

  useEffect(() => {
    setLoading(true);
    getSubdivisions(freshman.IdMatricola);
  }, []);

  if (isError)
    return (
      <TextInputFail
        label="Suddivisione*"
        retry={() => getSubdivisions(freshman.IdMatricola)}
      />
    );

  if (isLoading) return <ActivityIndicator />;

  const adapter = new SubdivisionItemAdapterFactory();
  return (
    <TouchableOpacity onPress={() => getSubdivisions(freshman.IdMatricola)}>
      <TextInputPicker
        label="Suddivisione*"
        items={adapter.fromCollection(subdivisions)}
        value={
          values.subdivision ? adapter.fromSingle(values.subdivision).title : ""
        }
        onValueChange={(x: ListItem<Subdivision.Subdivision>) => {
          setFieldValue("subdivision", x.value);
        }}
        onBlur={handleBlur("machineActivity")}
        error={!!errors.subdivision}
        errorText={errors.subdivision?.toString()}
      />
    </TouchableOpacity>
  );
};
