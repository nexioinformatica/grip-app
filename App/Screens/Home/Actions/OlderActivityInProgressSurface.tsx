import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as ORD from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { Activities, Operator } from "geom-api-ts-client";
import moment from "moment";
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

export const OlderActivityInProgressSurface = (): React.ReactElement => {
  const { call } = useContext(ApiContext);
  const makeCancellable = useCancelablePromise();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const [activities, setActivities] = useState<Activities.OperatorCollection>(
    []
  );
  const [olderHours, setOlderHours] = useState(0);

  const getActivities = () => {
    setError(false);
    setLoading(true);
    pipe(
      pipe(
        pipe({ settings: makeSettings() }, call(Operator.getMe)),
        TE.chain((operator: Operator.Single) =>
          pipe(
            {
              IdOperatore: operator.IdOperatore,
              settings: makeSettings(),
            },
            call(Activities.collectionByOperator)
          )
        ),
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

  useEffect(() => {
    const hours = pipe(
      activities,
      A.map((a) => a.DataOraInizio),
      A.sort(ORD.ordDate),
      A.findFirst(() => true),
      O.chain((d) => O.some(moment(d))),
      O.chain((m) => O.some(m.hours())),
      O.fold(
        () => 0,
        (h) => h
      )
    );
    setOlderHours(hours);
  }, [activities]);

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
        <Text style={styles.number}>{olderHours}</Text>
        <Text style={styles.um}>h</Text>
      </Surface>
      <Surface style={styles.desc}>
        <Paragraph style={styles.text}>
          Attività in corso da più tempo
        </Paragraph>
      </Surface>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", elevation: 0 },
  emph: { flex: 1, flexDirection: "row", elevation: 0 },
  desc: { flex: 2, elevation: 0 },
  number: { fontSize: 32 },
  text: { textAlign: "right" },
  um: { padding: 2 },
});
