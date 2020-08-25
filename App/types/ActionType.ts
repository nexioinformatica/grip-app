import { Activities } from "geom-api-ts-client";

export type ActionType = Activities.ActionType;
export type ActionTypeName = "Macchina e Operatore" | "Macchina" | "Operatore";
export const ActionTypeKey = Activities.ActionTypeKey;

export const getActionTypeName = (actionType: ActionType): ActionTypeName => {
  if (actionType == ActionTypeKey.MachineAndOperator)
    return "Macchina e Operatore";
  if (actionType == ActionTypeKey.Machine) return "Macchina";
  if (actionType == ActionTypeKey.Operator) return "Operatore";
  throw new Error("Invalid ActionType");
};

export const isRequiringMachine = (actionType: ActionType) => {
  return (
    actionType === ActionTypeKey.Machine ||
    actionType === ActionTypeKey.MachineAndOperator
  );
};
