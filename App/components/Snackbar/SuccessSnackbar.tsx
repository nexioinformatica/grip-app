import React from "react";
import { Snackbar } from "./Snackbar";
import { Text } from "react-native-paper";

type Props = {
  isSuccess: boolean;
  setSuccess: (x: boolean) => void;
};

export const SuccessSnackbar = ({ isSuccess, setSuccess }: Props) => {
  return (
    <Snackbar
      visible={isSuccess}
      onDismiss={() => {
        setSuccess(false);
      }}
      duration={3000}
    >
      <Text>Operazione effettuata con successo</Text>
    </Snackbar>
  );
};
