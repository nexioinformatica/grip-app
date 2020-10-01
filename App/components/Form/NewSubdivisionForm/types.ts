import { Shape, SizeValue } from "../../../types/Shape";

export type NewSubdivisionFormValues = {
  freshman?: { IdArticolo: number };
  shape?: Shape;
  description?: string;
  sizeValues: SizeValue[];
};
