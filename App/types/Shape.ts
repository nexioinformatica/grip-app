import { Shape } from "geom-api-ts-client";
import { ItemAdapter, ItemAdapterFactory } from "./ItemAdapter";

export type Shape = Shape.Shape;
export type Shapes = Shape.Collection;
export type Size = Shape.Size;
export type SizeValue = { Sigla: string; Valore: number };

export class ShapeItemAdapterFactory extends ItemAdapterFactory<Shape> {
  fromSingle(single: Shape): ItemAdapter<Shape> {
    return {
      key: single.IdForma.toString(),
      title: `${single.Descrizione}`,
      value: single,
    };
  }
}

export class SizeItemAdapterFactory extends ItemAdapterFactory<Size> {
  fromSingle(single: Size): ItemAdapter<Size> {
    return {
      key: single.Sigla.toString(),
      title: `${single.Descrizione} (${single.UM})`,
      value: single,
    };
  }
}
