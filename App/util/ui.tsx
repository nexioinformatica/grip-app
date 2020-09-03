import React from "react";
import { IconButton } from "react-native-paper";

export const getIcon = (icon: string) => (props: {
  focused: boolean;
  color: string;
  size: number;
}): React.ReactNode => {
  return <IconButton icon={icon} {...props} />;
};
