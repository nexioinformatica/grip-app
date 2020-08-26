import { ListItem } from "./Item";

export class ItemAdapter<T> implements ListItem<T> {
  key: string;
  value: T;
  title: string;

  constructor(key: string, label: string, value: T) {
    this.key = key;
    this.title = label;
    this.value = value;
  }
}

export abstract class ItemAdapterFactory<T> {
  abstract fromSingle(single: T): ItemAdapter<T>;
  abstract fromCollection(collection: T[]): ItemAdapter<T>[];
}
