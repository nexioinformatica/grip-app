import { RnViewStyleProp, RnTextStyleProp } from "native-base";

// Exported from native-base library.
// It do not expose this type, so a general toast cannot be created.
export interface ToastConfiguration {
  text: string;
  buttonText?: string;
  position?: "top" | "bottom" | "center";
  type?: "danger" | "success" | "warning";
  duration?: number;
  // tslint:disable-next-line:no-explicit-any
  onClose?: (reason: "user" | "timeout" | "functionCall") => any;
  style?: RnViewStyleProp;
  textStyle?: RnTextStyleProp;
  buttonTextStyle?: RnTextStyleProp;
  buttonStyle?: RnViewStyleProp;
}

export const generalErrorToast: ToastConfiguration = {
  text: "Coff coff, qualcosa è andato storto, riprova",
  duration: 3000,
  type: "danger",
};

export const generalSuccessToast: ToastConfiguration = {
  text: "Operazione effettuata con successo",
  duration: 3000,
  type: "success",
};
