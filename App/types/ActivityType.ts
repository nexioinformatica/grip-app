import { Activities } from "geom-api-ts-client";
import { ItemAdapterFactory, ItemAdapter } from "./ItemAdapter";

export type ActivityType = Activities.ActivityType.ActivityType;
export type ActivityTypes = Activities.ActivityType.Collection;

export class ActivityTypeItemAdapterFactory extends ItemAdapterFactory<
  ActivityType
> {
  fromSingle(single: ActivityType): ItemAdapter<ActivityType> {
    return {
      key: single.IdTipoAttivita.toString(),
      title: `(${single.Codice}) ${single.Descrizione}`,
      value: single,
    };
  }
  fromCollection(collection: ActivityTypes): ItemAdapter<ActivityType>[] {
    return collection.map((x) => this.fromSingle(x));
  }
}
