import React from "react";
import { Snackbar as PaperSnackbar } from "react-native-paper";
import { useTheme } from "react-native-paper";

type Props = React.ComponentProps<typeof PaperSnackbar>;

export const Snackbar = ({
  style,
  children,
  ...rest
}: Props): React.ReactElement => {
  const theme = useTheme();

  return (
    <PaperSnackbar
      style={[{ backgroundColor: theme.colors.surface }, style]}
      {...rest}
    >
      {children}
    </PaperSnackbar>
  );
};
