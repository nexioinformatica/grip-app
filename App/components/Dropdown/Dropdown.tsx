import React from "react";
import { Picker } from "native-base";

/**
 * An item for the picker where
 * - `value`: is the value of the item, can be also a complex object
 * - `label`: is the human-readable description of the item
 */
export interface Item<T> {
  value: T;
  label: string;
}

/**
 * The dropdown props, where
 * - `items`, an array of `Item` of a generic type `T` to use as picker elements
 * - `selected?`, a value of type `T`, eventually undefined, to use as default value
 * - `onValueChange`, callback selection of an item, returns the selected value with type `T`
 */
interface DropdownProps<T> {
  items: Item<T>[];
  selected?: T;
  onValueChange: (x: T) => void;
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
  onValueChange,
}: DropdownProps<T>) => {
  const handleValueChanged = (itemValue: any, itemPosition: number) => {
    onValueChange(itemValue);
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
        <Picker.Item label={x.label} value={x.value} key={i} />
      ))}
    </Picker>
  );
};
