import React, { useContext, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  List,
  Avatar,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { Operator } from "geom-api-ts-client";
import { makeSettings } from "../../util/api";
import { pipe } from "fp-ts/lib/pipeable";
import { ApiContext } from "../../stores";
import useCancellablePromise from "@rodw95/use-cancelable-promise";
import { toResultTask } from "../../util/fp";
import { getInitials } from "../../types";

type Operator = Operator.Single;

export interface Props {
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
