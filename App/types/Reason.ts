import { Warehouse } from "geom-api-ts-client";
import { ListItem } from "./Item";

export type Reason = Warehouse.Reason.Reason;
export type Reasons = Warehouse.Reason.Collection;

export class ReasonItemAdapter implements ListItem<Reason> {
  key: string;
  value: Reason;
  title: string;

  constructor(key: string, label: string, value: Reason) {
    this.key = key;
    this.title = label;
    this.value = value;
  }
}

export class ReasonItemsAdapterFactory {
  static fromReasons(reasons: Reasons): ReasonItemAdapter[] {
    return reasons.map(
      (x) =>
        new ReasonItemAdapter(
          x.IdCausale.toString(),
          `(${x.Codice}) ${x.Descrizione}`,
          x
        )
    );
  }
}
