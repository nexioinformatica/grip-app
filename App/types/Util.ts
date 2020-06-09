import * as O from "fp-ts/lib/Option";

export interface Entry<K, V> {
  key: K;
  value: V;
}

export type Entries<K, V> = Entry<K, V>[];

/**
 * An array of entries with a default value.
 */
export interface Data<K, T> {
  data: Entries<K, T>;
  default: O.Option<K>;
}
