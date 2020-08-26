import { Warehouse } from "geom-api-ts-client";

export type ReasonType = Warehouse.Movement.ReasonType;
export const ReasonTypeKey = Warehouse.Movement.ReasonTypeKey;
export type ReasonTypeName =
  | "Specificata"
  | "Scarico Produzione"
  | "Carico Produzione"
  | "Carico Avanzo"
  | "Carico Scarto";

export const getReasonTypeName = (reasonType: ReasonType): ReasonTypeName => {
  if (reasonType == ReasonTypeKey.Specified) return "Specificata";
  if (reasonType == ReasonTypeKey.UnloadProd) return "Scarico Produzione";
  if (reasonType == ReasonTypeKey.LoadProd) return "Carico Produzione";
  if (reasonType == ReasonTypeKey.LoadRemnant) return "Carico Avanzo";
  if (reasonType == ReasonTypeKey.LoadScrap) return "Carico Scarto";
  throw new Error("Invalid ActionType");
};

export const isRequiringReason = (reasonType: ReasonType): boolean => {
  return reasonType === ReasonTypeKey.Specified;
};
