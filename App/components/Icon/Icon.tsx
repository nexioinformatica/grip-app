import React from "react";
import { Icon as BaseIcon } from "react-native-elements";
import { iconSet } from "../../util/theme";

export const Icon = (props: any) => {
  return <BaseIcon type={iconSet} {...props} />;
};
