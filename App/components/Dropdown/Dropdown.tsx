import React, { useState } from "react";
import { Picker } from "native-base";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { ReasonType } from "../../types";

export type Key = string | number;

export interface Item<T> {
  label: string;
  value: T;
  key: Key;
}

interface Labellable<T> {
  label: string;
  key: T;
}

export const toItems = <U, T extends Labellable<U>>(data: T[]): Item<U>[] => {
  return pipe(
    data,
    A.mapWithIndex((i, x) => {
      return {
        key: i,
        label: x.label,
        value: x.key,
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

  console.log(selected);

  return (
    <Picker
      note
      mode="dropdown"
      style={{ width: "100%" }}
      selectedValue={ReasonType.LoadRemnant}
      onValueChange={handleValueChanged}
    >
      {items.map((x, i) => (
        <Picker.Item label={x.label} value={x.key} key={x.key} />
      ))}
    </Picker>
  );
};
