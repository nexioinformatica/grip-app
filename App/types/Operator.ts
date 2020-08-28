import { Operator } from "geom-api-ts-client";
import { ItemAdapterFactory, ItemAdapter } from "./ItemAdapter";

export type Operator = Operator.Operator;
export type Operators = Operator.Collection;

export class OperatorItemAdapterFactory extends ItemAdapterFactory<Operator> {
  fromSingle(single: Operator): ItemAdapter<Operator> {
    return {
      key: single.IdOperatore.toString(),
      title: `${single.Nome}`,
      description: `${single.Nome}`,
      value: single,
    };
  }
}
