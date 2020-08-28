import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Activities } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores";
import {
  ActivityType,
  ActivityTypeItemAdapterFactory,
  ActivityTypes,
} from "../../types/ActivityType";
import { ListItem } from "../../types/Item";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { TextInputPicker } from "../Dropdown";
import { TextInputFail } from "../TextInput";

interface ActivityTypePickerFormValues {
  activityType?: ActivityType;
}

const activityTypeItemAdapterFactory = new ActivityTypeItemAdapterFactory();

export const ActivityTypePickerFormField = <
  T extends ActivityTypePickerFormValues
>({
  setFieldValue,
  handleBlur,
  values,
  errors,
}: FormikProps<T>): React.ReactElement => {
  const makeCancelable = useCancellablePromise();
  const { call } = useContext(ApiContext);

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>([]);

  const getActivityTypes = () => {
    setLoading(true);
    setError(false);
    makeCancelable(
      pipe(
        call(Activities.ActivityType.getCollection)({
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then((activityTypes) => {
          setActivityTypes(activityTypes);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false))
    );
  };

  useEffect(() => {
    getActivityTypes();
  }, []);

  if (isError)
    return <TextInputFail label="Tipo Attività*" retry={getActivityTypes} />;

  if (isLoading) return <ActivityIndicator />;

  return (
    <TextInputPicker
      label="Tipo Attività*"
      items={activityTypeItemAdapterFactory.fromCollection(activityTypes)}
      value={
        values.activityType
          ? activityTypeItemAdapterFactory.fromSingle(values.activityType).title
          : ""
      }
      onValueChange={(x: ListItem<ActivityType>) => {
        setFieldValue("activityType", x.value);
      }}
      onBlur={handleBlur("activityType")}
      error={!!errors.activityType}
      errorText={errors.activityType?.toString()}
    />
  );
};
