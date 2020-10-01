import { Subdivision } from "geom-api-ts-client";
import { ItemAdapterFactory, ItemAdapter } from "./ItemAdapter";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";

export type Subdivision = Subdivision.Subdivision;
export type Subdivisions = Subdivision.Collection;

const gZero = (x: number) => x > 0;
const toStock = (x: boolean) => (x ? "disponibile" : "non disponibile");
const toAvailable = (x: boolean) => (x ? "in giacenza" : "non in giacenza");

export class SubdivisionItemAdapterFactory extends ItemAdapterFactory<
  Subdivision
> {
  fromSingle(single: Subdivision): ItemAdapter<Subdivision> {
    const stockQty = pipe(
      single.Quantita,
      A.map((x) => x.Giacenza),
      A.reduce(0, (x, xs) => x + xs)
    );

    const availableQty = pipe(
      single.Quantita,
      A.map((x) => x.Disponibilita),
      A.reduce(0, (x, xs) => x + xs)
    );

    const stockStr = pipe(stockQty, gZero, toStock);
    const availableStr = pipe(availableQty, gZero, toAvailable);

    return {
      key: single.IdSuddivisione.toString(),
      title: `${single.Descrizione}`,
      description: `${stockStr}, ${availableStr}`,
      value: single,
    };
  }
}
