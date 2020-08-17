import React, { useContext, useState, useEffect } from "react";
import { ListItem } from "react-native-elements";
// import { ApiContext } from "../../stores/api";
// import { Operators, Operator } from "../../types";
import { View, GestureResponderEvent } from "react-native";
import { pipe } from "fp-ts/lib/pipeable";
import * as EQ from "fp-ts/lib/Eq";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { ErrorContext } from "../../stores";
import { Toast, Text } from "native-base";
import { generalErrorToast } from "../../util/ui";
import { Operator } from "geom-api-ts-client";
import { logErrorIfAny, makeSettings } from "../../util/api";

export interface ChooseOperatorProps {
  selected?: Operator.Single;
  onSelect: (op: Operator.Single) => void;
}

const eqOperator = EQ.contramap(
  (operator: Operator.Single) => operator.IdOperatore
)(EQ.eqNumber);

const isSelected = (x: Operator.Single, ground: O.Option<Operator.Single>) =>
  pipe(
    ground,
    O.fold(
      () => false,
      (s) => eqOperator.equals(x, s)
    )
  );

export const ChooseOperator = ({ selected, onSelect }: ChooseOperatorProps) => {
  const [operators, setOperators] = useState<Operator.Collection>([]);

  const handlePress = (e: GestureResponderEvent) => (op: Operator.Single) => {
    onSelect(op);
  };

  useEffect(() => {
    pipe(
      Operator.getCollection({
        query: {
          params: { AbilitatoAPI: true, AbilitatoAttivitaReparto: true },
        },
        settings: makeSettings(),
      }),
      logErrorIfAny,
      TE.fold(
        (_) => T.never,
        (res: Operator.Collection) => {
          setOperators(res);
          return T.of(res);
        }
      )
    )();
  }, []);

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      {(operators.length &&
        operators.map((x, i) => (
          <ListItem
            key={i}
            title={x.Nome}
            subtitle={x.UserName}
            onPress={(e) => handlePress(e)(x)}
            checkmark={isSelected(x, O.fromNullable(selected))}
            bottomDivider
          />
        ))) || <Text>Nessun dato disponibile</Text>}
    </View>
  );
};
