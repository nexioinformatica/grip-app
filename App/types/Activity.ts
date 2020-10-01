import { Activities } from "geom-api-ts-client";
import { ItemAdapterFactory, ItemAdapter } from "./ItemAdapter";

export type MachineActivity = Activities.MachineActivity;
export type MachineActivityList = Activities.MachineCollection;

export type OperatorActivity = Activities.OperatorActivity;
export type OperatorActivityList = Activities.OperatorCollection;

export class MachineActivityItemAdapterFactory extends ItemAdapterFactory<
  MachineActivity
> {
  fromSingle(single: MachineActivity): ItemAdapter<MachineActivity> {
    return {
      key: single.IdAttivitaMacchina.toString(),
      title: `Attività ${single.IdAttivitaMacchina}`,
      description: `${single.Descrizione}`,
      value: single,
    };
  }
}

export class OperatorActivityItemAdapterFactory extends ItemAdapterFactory<
  OperatorActivity
> {
  fromSingle(single: OperatorActivity): ItemAdapter<OperatorActivity> {
    return {
      key: single.IdAttivitaOperatore.toString(),
      title: `Attività ${single.IdAttivitaOperatore}`,
      description: `${single.Descrizione}`,
      value: single,
    };
  }
}
