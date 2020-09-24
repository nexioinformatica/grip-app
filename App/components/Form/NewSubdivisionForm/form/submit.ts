import { Subdivision } from "geom-api-ts-client";
import { NewSubdivisionFormValues } from "../types";

export const makeValues = (
  values: NewSubdivisionFormValues
): Subdivision.NewSubdivision => ({
  IdArticolo: 1,
  IdForma: 1,
  Descrizione: values.description,
  Dimensioni: values.sizeValues,
});

export const handleSubmit = (values: NewSubdivisionFormValues) => {
  return;
};
