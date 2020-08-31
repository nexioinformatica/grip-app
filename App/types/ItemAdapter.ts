import { ListItem } from "./Item";

export class ItemAdapter<T> implements ListItem<T> {
  key: string;
  value: T;
  title: string;
  description?: string;

  constructor(key: string, label: string, value: T, description?: string) {
    this.key = key;
    this.title = label;
    this.value = value;
    this.description = description;
  }
}

export abstract class ItemAdapterFactory<T, U = T> {
  abstract fromSingle(single: U): ItemAdapter<T>;

  fromCollection(collection: U[]): ItemAdapter<T>[] {
    return collection.map((x) => this.fromSingle(x));
  }
}
