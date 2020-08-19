import * as EQ from "fp-ts/lib/Eq";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Operator } from "geom-api-ts-client";
import { Text } from "native-base";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ListItem } from "react-native-elements";

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

export const ChooseOperator = ({
  selected,
  onSelect,
}: ChooseOperatorProps): React.ReactElement => {
  const [operators, setOperators] = useState<Operator.Collection>([]);

  const handlePress = (op: Operator.Single) => {
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
        () => T.never,
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
            onPress={() => handlePress(x)}
            checkmark={isSelected(x, O.fromNullable(selected))}
            bottomDivider
          />
        ))) || <Text>Nessun dato disponibile</Text>}
    </View>
  );
};
