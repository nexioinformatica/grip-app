import React from "react";
import { Icon as BaseIcon, IconProps } from "react-native-elements";
import { iconSet } from "../../util/theme";

export const Icon = (props: IconProps): React.ReactElement => {
  return <BaseIcon type={iconSet} {...props} />;
};
