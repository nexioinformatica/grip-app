import { FormikProps } from "formik";
import { Shape } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { TextInputPicker } from "../Dropdown";
import { ShapeItemAdapterFactory } from "../../types/Shape";
import { TextInputFail } from "../TextInput";
import { noop } from "../../util/noop";
import { ApiContext } from "../../stores";
import useCancelablePromise from "@rodw95/use-cancelable-promise";
import { pipe } from "fp-ts/lib/pipeable";
import { toResultTask } from "../../util/fp";
import { makeSettings } from "../../util/api";
import { ActivityIndicator } from "react-native-paper";

type ShapePickerFormValues = {
  shape?: Shape.Shape;
};

type Props<T> = FormikProps<T> & { freshman?: { IdArticolo: number } };

export const ShapePickerFormField = <T extends ShapePickerFormValues>({
  freshman,
  ...formikProps
}: Props<T>): React.ReactElement => {
  const makeCancelable = useCancelablePromise();
  const { call } = useContext(ApiContext);

  const [shapes, setShapes] = useState<Shape.Collection>([]);

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const adapter = new ShapeItemAdapterFactory();

  const fetchShapes = (IdArticolo: number) => {
    setLoading(true);
    setError(false);

    makeCancelable(
      pipe(
        pipe(
          {
            IdArticolo: IdArticolo,
            settings: makeSettings(),
          },
          call(Shape.collection)
        ),
        toResultTask
      )()
        .then(setShapes)
        .catch((e) => {
          console.log(e);
          setError(true);
        })
        .finally(() => setLoading(false))
    );
  };

  if (!freshman)
    return (
      <TextInputFail
        label="Forma"
        errorText="Specificare una matricola per caricare la relativa lista di forme"
        retry={noop}
      />
    );

  useEffect(() => fetchShapes(freshman.IdArticolo), []);

  if (isError)
    return (
      <TextInputFail
        label="Forma"
        retry={() => fetchShapes(freshman.IdArticolo)}
      />
    );

  if (isLoading) return <ActivityIndicator />;

  return (
    <TextInputPicker
      label="Forma"
      items={adapter.fromCollection(shapes)}
      value={
        formikProps.values.shape
          ? adapter.fromSingle(formikProps.values.shape).title
          : ""
      }
      onValueChange={(x) => formikProps.setFieldValue("shape", x.value)}
      onBlur={formikProps.handleBlur("shape")}
      error={!!formikProps.errors.shape}
      errorText={formikProps.errors.shape?.toString()}
    />
  );
};
