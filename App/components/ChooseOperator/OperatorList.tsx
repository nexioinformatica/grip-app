import { pipe } from "fp-ts/lib/pipeable";
import { Operator } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  IconButton,
  List,
} from "react-native-paper";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores";
import { getInitials } from "../../types";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";

type Operator = Operator.Single;

interface Props {
  onSelectedValue: (operator: Operator) => void;
}

const OperatorList = ({ onSelectedValue }: Props): React.ReactElement => {
  const makeCancelable = useCancellablePromise();
  const { callPublic } = useContext(ApiContext);

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Operator[]>([]);

  const handleSelected = (x: Operator) => onSelectedValue(x);

  const getOperators = () =>
    makeCancelable(
      pipe(
        callPublic(Operator.getCollection)({
          query: {
            params: { AbilitatoAPI: true, AbilitatoAttivitaReparto: true },
          },
          settings: makeSettings(),
        }),
        toResultTask
      )()
    );

  useEffect(() => {
    getOperators()
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch(() => setError(true));
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
          disabled={!x.Attivo}
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
};

const MemoOperatorList = React.memo(OperatorList);

export { MemoOperatorList as OperatorList };

const styles = StyleSheet.create({
  warningBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
});
