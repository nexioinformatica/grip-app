import React, { useState, useContext } from "react";
import { Container, Button, Text, Content } from "native-base";
import { Input } from "react-native-elements";
import { StyleSheet, View } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { ErrorContext } from "../../stores";
import * as E from "fp-ts/lib/Either";

interface ErrorProps {}

export const Error = (props: ErrorProps): React.ReactElement => {
  const { error, setError } = useContext(ErrorContext);

  // Exit the error screen cleaning the error.
  const handleClear = () => setError(undefined);

  return (
    <Container>
      <Content padder>
        <Text>Errore</Text>
        <Text>{error?.message}</Text>
        <Button onPress={handleClear}>
          <Text>OK</Text>
        </Button>
      </Content>
    </Container>
  );
};
