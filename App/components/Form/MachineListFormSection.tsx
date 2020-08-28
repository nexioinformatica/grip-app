import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Machine as MachineApi } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores";
import { ListItem } from "../../types/Item";
import {
  Machine,
  MachineItemAdapterFactory,
  Machines,
} from "../../types/Machine";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { TextInputPicker } from "../Dropdown";
import { TextInputFail } from "../TextInput";

interface MachineFormValues {
  machine?: Machine;
  barcode: {
    machine: string;
  };
}

const machineItemAdapterFactory = new MachineItemAdapterFactory();

export const MachineListFormSection = <T extends MachineFormValues>({
  setFieldValue,
  handleBlur,
  values,
  errors,
}: FormikProps<T>): React.ReactElement => {
  const makeCancelable = useCancellablePromise();
  const { call } = useContext(ApiContext);

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [machineList, setMachineList] = useState<Machines>([]);

  const getMachineList = () => {
    setLoading(true);
    setError(false);
    makeCancelable(
      pipe(
        call(MachineApi.getCollection)({
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then((machineList) => {
          setMachineList(machineList);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false))
    );
  };

  useEffect(() => {
    getMachineList();
  }, []);

  if (isError)
    return <TextInputFail label="Macchina*" retry={getMachineList} />;

  if (isLoading) return <ActivityIndicator />;

  return (
    <>
      <TextInputPicker
        label="Macchina*"
        items={machineItemAdapterFactory.fromCollection(machineList)}
        value={
          values.machine
            ? machineItemAdapterFactory.fromSingle(values.machine).title
            : ""
        }
        onValueChange={(x: ListItem<Machine>) => {
          setFieldValue("machine", x.value);
        }}
        onBlur={handleBlur("activityType")}
        error={!!errors.machine}
        errorText={errors.machine?.toString()}
      />
    </>
  );
};
