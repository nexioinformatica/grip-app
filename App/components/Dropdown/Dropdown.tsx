import React, { useState } from "react";
import { Picker } from "native-base";
import { Entry, Entries, Data } from "../../types/Util";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { foldDefault } from "../../util/fp";

export type Key = string | number;

export interface Item<T> {
  label: string;
  value: T;
  key: Key;
}

export const toItems = <K,>(
  data: Entries<K, string>,
  f: (k: K) => Key
): Item<Entry<K, string>>[] => {
  return pipe(
    data,
    A.mapWithIndex((i, x) => {
      return {
        key: f(x.key),
        label: x.value,
        value: x,
      };
    })
  );
};

interface DropdownProps<T> {
  items: Item<T>[];
  selected?: Key;
  onValueChange: (x: T) => void;
}

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
        <Picker.Item label={x.label} value={x.value} key={x.key} />
      ))}
    </Picker>
  );
};
