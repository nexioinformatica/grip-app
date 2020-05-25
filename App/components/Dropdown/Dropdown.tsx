import React, { useState } from "react";
import { Picker } from "native-base";

export type Key = string | number | undefined;

export interface Item<T> {
  label: string;
  value: T;
  key: Key;
}

interface DropdownProps<T> {
  items: Item<T>[];
  def?: Key;
  onValueChange?: (x: T) => void;
}

export const Dropdown = ({
  items,
  def,
  onValueChange,
}: DropdownProps<any>): React.ReactElement => {
  const [selected, setSelected] = useState<Key>(def);
  const handleValueChanged = (itemValue: any, itemPosition: number) => {
    setSelected(itemValue);
    if (onValueChange) onValueChange(itemValue);
  };

  return (
    <Picker
      note
      mode="dropdown"
      style={{ width: "100%" }}
      selectedValue={selected}
      onValueChange={handleValueChanged}
    >
      {items.map((x, i) => (
        <Picker.Item label={x.label} value={x.value} key={x.key} />
      ))}
    </Picker>
  );
};
