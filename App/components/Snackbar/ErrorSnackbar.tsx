import React from "react";
import { Snackbar } from "./Snackbar";
import { Text } from "react-native-paper";

type Props = {
  isError: boolean;
  setError: (x: boolean) => void;
};

export const ErrorSnackbar = ({
  isError: isSuccess,
  setError: setSuccess,
}: Props): React.ReactElement => {
  return (
    <Snackbar
      visible={isSuccess}
      onDismiss={() => {
        setSuccess(false);
      }}
      duration={3000}
    >
      <Text>Coff coff, qualcosa è andato storto</Text>
    </Snackbar>
  );
};
