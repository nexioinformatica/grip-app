import React, { memo, Suspense, useContext, useState, useEffect } from "react";
import { ScrollView, AsyncStorage, StyleSheet, View } from "react-native";
import {
  List,
  Avatar,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { Operator } from "geom-api-ts-client";
import { isEmptyArray } from "formik";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { makeSettings } from "../../util/api";
import { pipe } from "fp-ts/lib/pipeable";
import { ApiContext } from "../../stores";

type Operator = Operator.Single;

export interface Props {
  onSelectedValue: (operator: Operator) => void;
}

export const OperatorList = memo(({ onSelectedValue }: Props) => {
  const { callPublic } = useContext(ApiContext);

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Operator[]>([]);

  const handleSelected = (x: Operator) => onSelectedValue(x);

  const getOperators = pipe(
    callPublic(Operator.getCollection)({
      query: {
        params: { AbilitatoAPI: true, AbilitatoAttivitaReparto: true },
      },
      settings: makeSettings(),
    }),
    TE.fold(
      (err) => {
        setError(true);
        return TE.left(err);
      },
      (res: Operator.Collection) => {
        setLoading(false);
        setData(res);
        return TE.right(res);
      }
    )
  );

  useEffect(() => {
    getOperators();
  }, []);

  if (isError)
    return (
      <View style={styles.warningBox}>
        <IconButton icon="alert" />
      </View>
    );

  if (isLoading) return <ActivityIndicator />;

  return (
    <ScrollView>
      {data.map((x, i) => (
        <List.Item
          key={i}
          title={x.Nome}
          description={x.UserName}
          disabled={x.Attivo}
          onPress={() => handleSelected(x)}
          left={(props) => (
            <Avatar.Text
              {...props}
              size={48}
              label={getInitials(x.Nome)}
              color="#fff"
            />
          )}
        />
      ))}
    </ScrollView>
  );
});

/** @returns A string of two uppercase letters, representing name initials. */
const getInitials = (name: string) => {
  var matched = name.match(/\b\w/g) || [];
  return ((matched.shift() || "") + (matched.pop() || "")).toUpperCase();
};

const styles = StyleSheet.create({
  warningBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
});
