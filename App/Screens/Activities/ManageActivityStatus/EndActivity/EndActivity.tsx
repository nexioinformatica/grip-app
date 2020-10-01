import { Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "geom-api-ts-client";
import React, { useContext, useState } from "react";
import { ScrollView } from "react-native";
import { Card } from "react-native-paper";
import * as Yup from "yup";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { Container, Content } from "../../../../components/Container";
import {
  PhaseFormField,
  ResetButton,
  SendButton,
} from "../../../../components/FormField";
import {
  ErrorSnackbar,
  SuccessSnackbar,
} from "../../../../components/Snackbar";
import { end } from "../../../../data/JobResource";
import { ApiContext } from "../../../../stores";
import { makeSettings } from "../../../../util/api";
import { toResultTask } from "../../../../util/fp";

interface FormValues {
  phase?: Barcode.PhaseDecode;
  barcode: {
    phase: string;
  };
}

const initialValues: FormValues = {
  barcode: {
    phase: "",
  },
};

const validationSchema = Yup.object({
  phase: Yup.mixed().required("Il campo Fase è richiesto."),
});

export const EndActivity = (): React.ReactElement => {
  const makeCancellable = useCancellablePromise();
  const { call } = useContext(ApiContext);

  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const apiMethod = end(call)(makeSettings());

  const handleSubmit = (values: FormValues) => {
    setError(false);
    setSuccess(false);

    return pipe(
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      pipe(values.phase!.Oggetto.IdFase, apiMethod, toResultTask)(),
      makeCancellable
    )
      .then(() => setSuccess(true))
      .catch(() => setError(true));
  };

  return (
    <Container>
      <ScrollView>
        <Content>
          <Card>
            <Card.Title title="Fine attività" />
            <Card.Content>
              <Formik<FormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {(formikProps) => {
                  return (
                    <>
                      <PhaseFormField {...formikProps} />
                      <SendButton<FormValues> {...formikProps}>
                        Invia
                      </SendButton>
                      <ResetButton<FormValues> {...formikProps}>
                        Reset
                      </ResetButton>
                    </>
                  );
                }}
              </Formik>
            </Card.Content>
          </Card>
        </Content>
      </ScrollView>
      <ErrorSnackbar isError={isError} setError={setError} />
      <SuccessSnackbar isSuccess={isSuccess} setSuccess={setSuccess} />
    </Container>
  );
};
