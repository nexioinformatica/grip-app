import * as O from "fp-ts/lib/Option";

export interface Entry<K, V> {
  key: K;
  value: V;
}

export type Entries<K, V> = Entry<K, V>[];

export interface Data<K, V> {
  data: Entries<K, V>;
  default: O.Option<K>;
}
