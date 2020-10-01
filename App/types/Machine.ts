import { Machine } from "geom-api-ts-client";
import { ItemAdapterFactory, ItemAdapter } from "./ItemAdapter";

export type Machine = Machine.Machine;
export type Machines = Machine.Collection;

export class MachineItemAdapterFactory extends ItemAdapterFactory<Machine> {
  fromSingle(single: Machine): ItemAdapter<Machine> {
    return {
      key: single.IdMacchina.toString(),
      title: `(${single.Codice}) ${single.Descrizione}`,
      value: single,
    };
  }
}
