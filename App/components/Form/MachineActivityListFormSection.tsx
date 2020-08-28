import React, { useContext, useState, useEffect } from "react";
import { FormikProps } from "formik";
import useCancellablePromise from "@rodw95/use-cancelable-promise";
import { ApiContext } from "../../stores";
import { pipe } from "fp-ts/lib/pipeable";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { TextInputFail } from "../Auth/TextInputFail";
import { ActivityIndicator } from "react-native-paper";
import { TextInputPicker } from "../Dropdown";
import { ListItem } from "../../types/Item";
import {
  MachineActivity,
  MachineActivityList,
  MachineActivityItemAdapterFactory,
} from "../../types/Activity";
import { Activities } from "geom-api-ts-client";
import { noop } from "../../util/noop";
import { Machine } from "../../types/Machine";

interface MachineActivityFormValues {
  machineActivity?: MachineActivity;
}

const machineActivityItemAdapterFactory = new MachineActivityItemAdapterFactory();

export const MachineActivityListFormSection = <
  T extends MachineActivityFormValues
>({
  machine,
  setFieldValue,
  handleBlur,
  values,
  errors,
}: FormikProps<T> & { machine?: Machine }): React.ReactElement => {
  const makeCancelable = useCancellablePromise();
  const { call } = useContext(ApiContext);

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [machineActivityList, setMachineActivityList] = useState<
    MachineActivityList
  >([]);

  const getMachineActivityList = (IdMacchina: number) => {
    setLoading(true);
    setError(false);
    makeCancelable(
      pipe(
        call(Activities.collectionByMachine)({
          IdMacchina: IdMacchina,
          settings: makeSettings(),
        }),
        toResultTask
      )()
        .then((machineList) => {
          setMachineActivityList(machineList);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false))
    );
  };

  if (!machine)
    return (
      <TextInputFail
        label="Attività Macchina*"
        errorText="Specificare una macchina per caricare la relativa lista di attività"
        retry={noop}
      />
    );

  useEffect(() => {
    getMachineActivityList(machine.IdMacchina);
  }, [machine]);

  if (isError)
    return (
      <TextInputFail
        label="Attività Macchina*"
        retry={() => getMachineActivityList(machine.IdMacchina)}
      />
    );

  if (isLoading) return <ActivityIndicator />;

  return (
    <>
      <TextInputPicker
        label="Attività Macchina*"
        items={machineActivityItemAdapterFactory.fromCollection(
          machineActivityList
        )}
        value={
          values.machineActivity
            ? machineActivityItemAdapterFactory.fromSingle(
                values.machineActivity
              ).title
            : ""
        }
        onValueChange={(x: ListItem<MachineActivity>) => {
          setFieldValue("machineActivity", x.value);
        }}
        onBlur={handleBlur("machineActivity")}
        error={!!errors.machineActivity}
        errorText={errors.machineActivity?.toString()}
      />
    </>
  );
};
