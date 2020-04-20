import { BarcodeEvent } from "../../types";

export type ScanInputListData = ScanInputData[];

export interface ScanInputData {
  key: string;
  value: string;
  onChangeText: (t: string) => void;
  title: string;
  onIconPress: () => void;
}

export * from "./ScanInput";
export * from "./ScanInputList";
