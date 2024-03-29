import {
  ActionType,
  ActionTypeKey,
  getActionTypeName,
} from "../types/ActionType";
import { Item } from "../types/Item";

export const getActionTypesData = (): Item<string, ActionType>[] =>
  [
    ActionTypeKey.MachineAndOperator,
    ActionTypeKey.Machine,
    ActionTypeKey.Operator,
  ].map((x) => ({
    key: x.toString(),
    value: x,
    label: getActionTypeName(x),
  }));
