import { ActionTypeKey, getActionTypeName } from "../types/ActionType";

export const getActionTypesData = () =>
  [
    ActionTypeKey.MachineAndOperator,
    ActionTypeKey.Machine,
    ActionTypeKey.Operator,
  ].map((x, i) => ({
    key: i.toString(),
    value: x,
    label: getActionTypeName(x),
  }));
