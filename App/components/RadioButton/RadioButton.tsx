import React from "react";
import { RadioButton as Radio } from "react-native-paper";
import _ from "lodash";

type Key = string;

type Item<T> = {
  value: T;
  label: string;
  key: Key;
};

type Props<T> = {
  items: Item<T>[];
  selected: Key;
  onSelectedChange: ({ k, v }: { k: Key; v: T }) => void;
};

export const RadioButton = <T,>({
  items,
  selected,
  onSelectedChange,
}: Props<T>): React.ReactElement => {
  const handleValueChange = (selected: string) => {
    const item = _.find(items, (x) => x.key == selected);
    if (!item)
      throw new Error(
        "Selected RadioButton key was not found in the item list."
      );
    onSelectedChange({ k: selected, v: item.value });
  };

  return (
    <Radio.Group onValueChange={handleValueChange} value={selected}>
      {items.map((x, i) => {
        return <Radio.Item key={i} label={x.label} value={x.key} />;
      })}
    </Radio.Group>
  );
};
