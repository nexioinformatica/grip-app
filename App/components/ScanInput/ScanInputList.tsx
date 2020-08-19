import React from "react";
import { StyleSheet } from "react-native";

import { ScanInputListData } from "./";
import { ScanInput } from "./ScanInput";

interface ScanInputListProps {
  scanInputList: ScanInputListData;
}

export { ScanInputListComponet as ScanInputList };

const ScanInputListComponet = ({
  scanInputList,
}: ScanInputListProps): React.ReactElement => {
  const data = scanInputList;
  return (
    <>
      {data.map((d) => (
        <ScanInput
          key={d.key}
          placeholder={d.title}
          value={d.value}
          onChangeText={d.onChangeText}
          onIconPress={d.onIconPress}
          containerStyle={styles.item}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
  },
});
