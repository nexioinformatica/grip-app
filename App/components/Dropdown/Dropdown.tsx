import React from "react";
import { Picker } from "native-base";

export type Key = string | number;

/**
 * An item for the picker where
 * - `value`: is the value of the item, can be also a complex object
 * - `label`: is the human-readable description of the item
 * - `key`: the value key, basic type
 */
export interface Item<T> {
  value: T;
  label: string;
  key: Key;
}

/**
 * The dropdown props, where
 * - `items`, an array of `Item` of a generic type `T` to use as picker elements
 * - `selected?`, a value of type `T`, eventually undefined, to use as default value
 * - `onSelectedChange`, callback selection of an item, returns the selected value with
 *    its key (type `Key`) and its value (type `T`).
 */
interface DropdownProps<T> {
  items: Item<T>[];
  selected?: Key;
  onSelectedChange: ({ k, v }: { k: Key; v: T }) => void;
}

/**
 * A generic dropdown component that allows to display and array of items with value
 *  with a default selected value.
 *
 * @param
 */
export const Dropdown = <T,>({
  items,
  selected,
  onSelectedChange,
}: DropdownProps<T>) => {
  const handleValueChanged = (itemValue: any, itemPosition: number) => {
    onSelectedChange({ k: itemValue, v: items[itemPosition].value });
  };

  return (
    <Picker
      mode="dropdown"
      style={{ width: "100%" }}
      selectedValue={selected}
      onValueChange={handleValueChanged}
    >
      {items.map((x, i) => (
        <Picker.Item label={x.label} value={x.key} key={i} />
      ))}
    </Picker>
  );
};
