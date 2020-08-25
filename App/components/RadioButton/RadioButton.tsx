import React, { memo } from "react";
import { RadioButton as Radio } from "react-native-paper";
import * as _ from "lodash";

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
}: Props<T>) => {
  const handleValueChange = (selected: string) => {
    const item = _.find(items, (x) => x.key == selected);
    if (!item) throw new Error("Something went wrong");
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
