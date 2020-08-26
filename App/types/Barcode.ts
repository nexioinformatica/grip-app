import { Barcode } from "geom-api-ts-client";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

export type BarcodeDecode = Barcode.BarcodeDecode;
type SingleBarcodeDecode = {
  Tipo: "O" | "M" | "T" | "P" | "F" | "A" | "L" | "S" | "C";
  Id: any;
};

type Machine = { IdMacchina: number };

interface DecodeStrategy {
  filterPredicate(x: SingleBarcodeDecode): boolean;
}

class Decoder {
  strategy: DecodeStrategy;

  constructor(decodeStrategy: DecodeStrategy) {
    this.strategy = decodeStrategy;
  }

  from(bd: BarcodeDecode): Machine | undefined {
    return pipe(
      bd,
      A.filter(this.strategy.filterPredicate),
      O.fromPredicate((xs) => A.isNonEmpty(xs)),
      O.fold(
        () => undefined,
        (x) => {
          return x[0].Id as Machine;
        }
      )
    );
  }
}

class MachineDecodeStrategy implements DecodeStrategy {
  filterPredicate(x: SingleBarcodeDecode): boolean {
    return x.Tipo === "M";
  }
}
