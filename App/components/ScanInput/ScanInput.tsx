import React from "react";
import { Input, InputProps } from "react-native-elements";
import { Icon } from "../Icon/Icon";
import { noop } from "../../util/noop";

export interface ScanInputProps extends InputProps {
  onIconPress?: () => void;
}

export const ScanInput = ({
  onIconPress,
  ...rest
}: ScanInputProps): React.ReactElement => {
  return (
    <Input
      {...rest}
      rightIcon={
        <Icon name="camera" onPress={onIconPress ? onIconPress : noop} />
      }
    />
  );
};
