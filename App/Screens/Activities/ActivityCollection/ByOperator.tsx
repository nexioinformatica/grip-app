import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import {
  Surface,
  List,
  IconButton,
  ActivityIndicator,
  Card,
} from "react-native-paper";
import { pipe } from "fp-ts/lib/pipeable";
import { Activities } from "geom-api-ts-client";
import { makeSettings } from "../../../util/api";
import { ApiContext } from "../../../stores";
import { toResultTask } from "../../../util/fp";
import useCancelablePromise from "@rodw95/use-cancelable-promise";
import { collectionByOperator } from "../../../data/ActivityResource";

export const ByOperator = (): React.ReactElement => {
  const { call } = useContext(ApiContext);
  const makeCancelable = useCancelablePromise();

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Activities.OperatorCollection>(
    []
  );

  const getActivities = () => {
    setError(false);
    setLoading(true);
    pipe(
      pipe(makeSettings(), collectionByOperator(call), toResultTask)(),
      makeCancelable
    )
      .then((activities) => setActivities(activities))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => getActivities(), []);

  if (isError)
    return (
      <Surface style={styles.container}>
        <View style={{ ...styles.content, alignSelf: "center" }}>
          <IconButton icon="alert" onPress={getActivities} />
        </View>
      </Surface>
    );
  if (isLoading)
    return (
      <Surface style={styles.container}>
        <View style={{ ...styles.content, alignSelf: "center" }}>
          <ActivityIndicator />
        </View>
      </Surface>
    );

  return (
    <Surface style={styles.container}>
      <ScrollView>
        <Surface style={styles.content}>
          <Card>
            <Card.Title title="Attività operatore" />
            <Card.Content>
              <List.Section title="Lista attività">
                {activities.map((x, i) => (
                  <List.Item
                    key={i}
                    title={`Attività ${x.IdAttivitaOperatore}`}
                    description={x.Descrizione}
                  />
                ))}
              </List.Section>
            </Card.Content>
          </Card>
        </Surface>
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
});
