import {
  getReasonTypeName,
  ReasonTypeKey,
  ReasonType,
} from "../types/ReasonType";
import { Item } from "../types/Item";

export const getReasonTypesData = (): Item<string, ReasonType>[] =>
  [
    ReasonTypeKey.Specified,
    ReasonTypeKey.UnloadProd,
    ReasonTypeKey.LoadProd,
    ReasonTypeKey.LoadRemnant,
    ReasonTypeKey.LoadScrap,
  ].map((x) => ({
    key: x.toString(),
    value: x,
    label: getReasonTypeName(x),
  }));
