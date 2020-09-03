import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import {
  Surface,
  List,
  IconButton,
  ActivityIndicator,
  Text,
  Button,
  useTheme,
  Card,
} from "react-native-paper";
import { pipe } from "fp-ts/lib/pipeable";
import { Activities, Machine } from "geom-api-ts-client";
import { makeSettings } from "../../../util/api";
import { ApiContext } from "../../../stores";
import { toResultTask } from "../../../util/fp";
import useCancelablePromise from "@rodw95/use-cancelable-promise";
import { collectionByMachine } from "../../../data/ActivityResource";
import { MachinePickerFormField } from "../../../components/FormField";
import { Formik } from "formik";
import { noop } from "../../../util/noop";

interface FormValues {
  machine?: Machine.Machine;
  barcode: {
    machine: string;
  };
}

const initialValues: FormValues = {
  barcode: {
    machine: "",
  },
};

export const ByMachine = (): React.ReactElement => {
  return (
    <Surface style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Formik<FormValues> initialValues={initialValues} onSubmit={noop}>
            {(formikProps) => {
              const { values, handleReset } = formikProps;

              const machinePicker = <MachinePickerFormField {...formikProps} />;
              const machineList = (values.machine && (
                <ActivityList machine={values.machine} />
              )) || <List.Item title="Nessuna attività" />;

              return (
                <>
                  <Card>
                    <Card.Title title="Attività macchina" />
                    <Card.Content>
                      <List.Section title="Scegli la macchina">
                        {machinePicker}
                        <Button mode="outlined" onPress={handleReset}>
                          Pulisci filtro
                        </Button>
                      </List.Section>
                      <List.Section title="Lista attività">
                        {machineList}
                      </List.Section>
                    </Card.Content>
                  </Card>
                </>
              );
            }}
          </Formik>
        </View>
      </ScrollView>
    </Surface>
  );
};

const ActivityList = ({ machine }: { machine?: Machine.Machine }) => {
  const { call } = useContext(ApiContext);
  const makeCancelable = useCancelablePromise();

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Activities.MachineCollection>(
    []
  );

  const getActivities = (IdMacchina: number) => {
    setError(false);
    setLoading(true);
    pipe(
      pipe(
        IdMacchina,
        collectionByMachine(call)(makeSettings()),
        toResultTask
      )(),
      makeCancelable
    )
      .then((activities) => setActivities(activities))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  if (!machine) return <MachineNeededComponent />;

  useEffect(() => getActivities(machine.IdMacchina), []);

  if (isError)
    return <ErrorComponent retry={() => getActivities(machine.IdMacchina)} />;

  if (isLoading) return <LoadingComponent />;

  return (
    <>
      {activities.map((x, i) => (
        <List.Item
          key={i}
          title={`Attività ${x.IdAttivitaMacchina}`}
          description={x.Descrizione}
        />
      ))}
    </>
  );
};

const ErrorComponent = ({ retry }: { retry: () => void }) => (
  <Surface style={styles.container}>
    <View style={{ ...styles.content, alignSelf: "center" }}>
      <IconButton icon="alert" onPress={retry} />
    </View>
  </Surface>
);

const LoadingComponent = () => (
  <Surface style={styles.container}>
    <View style={{ ...styles.content, alignSelf: "center" }}>
      <ActivityIndicator />
    </View>
  </Surface>
);

const MachineNeededComponent = () => (
  <Surface style={styles.container}>
    <View style={{ ...styles.content, alignSelf: "center" }}>
      <Text>Specificare una macchina</Text>
    </View>
  </Surface>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
});
