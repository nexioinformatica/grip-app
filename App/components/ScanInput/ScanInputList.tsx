import React from "react";
import { Input, InputProps } from "react-native-elements";
import { Icon } from "../Icon/Icon";
import { noop } from "../../util/noop";
import { ScanInput } from "./ScanInput";
import { StyleSheet } from "react-native";
import { ScanInputListData } from "./.";

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
      {data.map((d, i) => (
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
