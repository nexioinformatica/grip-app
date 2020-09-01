import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { Activities, Operator } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Paragraph,
  Surface,
  Text,
} from "react-native-paper";

import useCancelablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../../stores";
import { makeSettings } from "../../../util/api";
import { toResultTask } from "../../../util/fp";

export const InProgressActivitiesSurface = (): React.ReactElement => {
  const { call } = useContext(ApiContext);
  const makeCancellable = useCancelablePromise();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const [activities, setActivities] = useState<Activities.OperatorCollection>(
    []
  );

  const getActivities = () => {
    setError(false);
    setLoading(true);
    pipe(
      pipe(
        TE.chain((y: Operator.Single) =>
          pipe(
            {
              IdOperatore: y.IdOperatore,
              settings: makeSettings(),
            },
            call(Activities.collectionByOperator)
          )
        )(pipe({ settings: makeSettings() }, call(Operator.getMe))),
        toResultTask
      )(),
      makeCancellable
    )
      .then((activities) => setActivities(activities))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getActivities();
  }, []);

  if (isError)
    return (
      <Surface style={{ ...styles.container, alignSelf: "center" }}>
        <IconButton icon="alert" onPress={getActivities} />
      </Surface>
    );

  if (isLoading)
    return (
      <Surface style={{ ...styles.container, alignSelf: "center" }}>
        <ActivityIndicator />
      </Surface>
    );

  return (
    <Surface style={styles.container}>
      <Surface style={styles.emph}>
        <Text style={styles.number}>{activities.length}</Text>
      </Surface>
      <Surface style={styles.desc}>
        <Paragraph style={styles.text}>Attività in corso</Paragraph>
      </Surface>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", elevation: 0 },
  emph: { flex: 1, elevation: 0 },
  desc: { flex: 2, elevation: 0 },
  number: { fontSize: 32 },
  text: { textAlign: "right" },
});
