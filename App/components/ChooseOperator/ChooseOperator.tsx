import React, { useContext, useState } from "react";
import { ListItem } from "react-native-elements";
import { ApiContext } from "../../stores/api";
import { Operators, Operator } from "../../types";
import { View, GestureResponderEvent } from "react-native";
import { pipe } from "fp-ts/lib/pipeable";
import * as EQ from "fp-ts/lib/Eq";
import * as O from "fp-ts/lib/Option";
import { ErrorContext } from "../../stores";

export interface ChooseOperatorProps {
  selected?: Operator;
  onSelect: (op: Operator) => void;
}

const eqOperator = EQ.contramap((operator: Operator) => operator.IdOperatore)(
  EQ.eqNumber
);

const isSelected = (x: Operator, ground: O.Option<Operator>) =>
  pipe(
    ground,
    O.fold(
      () => false,
      (s) => eqOperator.equals(x, s)
    )
  );

export const ChooseOperator = ({ selected, onSelect }: ChooseOperatorProps) => {
  const { setError } = useContext(ErrorContext);
  const { api } = useContext(ApiContext);

  const [operators, setOperators] = useState<Operators>([]);

  const handlePress = (e: GestureResponderEvent) => (op: Operator) => {
    onSelect(op);
  };

  api
    .operators(true, true)()
    .then((data) => setOperators(data))
    .catch((err) => setError(err));

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      {operators.map((x, i) => (
        <ListItem
          key={i}
          title={x.Nome}
          subtitle={x.UserName}
          onPress={(e) => handlePress(e)(x)}
          checkmark={isSelected(x, O.fromNullable(selected))}
          bottomDivider
        />
      ))}
    </View>
  );
};
