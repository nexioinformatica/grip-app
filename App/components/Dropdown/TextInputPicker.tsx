import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

import { ListItem } from "../../types/Item";
import { TextInput, TextInputProps } from "../TextInput";
import { DialogPicker } from "./DialogPicker";
import { View } from "react-native";

type Props<T> = TextInputProps & {
  items: ListItem<T>[];
  value?: string;
  onValueChange: (x: ListItem<T>) => void;
};

export const TextInputPicker = <T,>({
  items,
  value,
  onValueChange,
  ...rest
}: Props<T>): React.ReactElement => {
  const [isVisible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };

  const handleSelectedChange = (x: ListItem<T>) => {
    onValueChange(x);
  };

  return (
    <>
      <TouchableOpacity onPress={showDialog}>
        <View pointerEvents="none">
          <TextInput value={value} editable={false} {...rest} />
        </View>
      </TouchableOpacity>

      <DialogPicker<T>
        visible={isVisible}
        hide={hideDialog}
        items={items}
        onSelectedChange={handleSelectedChange}
      />
    </>
  );
};
