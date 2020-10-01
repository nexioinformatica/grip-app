import * as Yup from "yup";

export const validationSchema = Yup.object({
  description: Yup.string(),
  sizes: Yup.array()
    .of(
      Yup.object().shape({
        Sigla: Yup.string().required(),
        Valore: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .min(0, "Il campo deve essere maggiore o uguale a zero")
          .required("Il campo è richiesto"),
      })
    )
    .required(),
});
