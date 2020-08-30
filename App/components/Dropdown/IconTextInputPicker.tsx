import React, { useState } from "react";

import { ListItem } from "../../types/Item";
import { TextInput, TextInputProps, TextInputIcon } from "../TextInput";
import { DialogPicker } from "./DialogPicker";

type Props = TextInputProps & {
  items: ListItem<string>[];
  value?: string;
  onChangeText: (text: string) => void;
  rightIcon: string;
};

export const IconTextInputPicker = ({
  items,
  value,
  onChangeText,
  rightIcon,
  ...rest
}: Props): React.ReactElement => {
  const [isVisible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };

  const handleSelectedChange = (x: ListItem<string>) => {
    onChangeText(x.value);
  };

  return (
    <>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        right={<TextInputIcon name={rightIcon} onPress={showDialog} />}
        {...rest}
      />

      <DialogPicker<string>
        visible={isVisible}
        hide={hideDialog}
        items={items}
        onSelectedChange={handleSelectedChange}
      />
    </>
  );
};
