import React from "react";
import { Surface } from "react-native-paper";

export const FlatSurface = ({
  children,
  style,
  ...rest
}: React.ComponentProps<typeof Surface>) => (
  <Surface style={[{ elevation: 0 }, style]} {...rest}>
    {children}
  </Surface>
);
