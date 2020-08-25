import { getReasonTypeName, ReasonTypeKey } from "../types/ReasonType";

export const getReasonTypesData = () =>
  [
    ReasonTypeKey.Specified,
    ReasonTypeKey.UnloadProd,
    ReasonTypeKey.LoadProd,
    ReasonTypeKey.LoadRemnant,
    ReasonTypeKey.LoadScrap,
  ].map((x, i) => ({
    key: i.toString(),
    value: x,
    label: getReasonTypeName(x),
  }));
