import { Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Authentication } from "geom-api-ts-client";
import React, { useContext, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { Caption, Surface, Text } from "react-native-paper";
import * as Yup from "yup";

import { BackgroundCenter, Button, Header, Logo } from "../../components/Auth";
import {
  PasswordFormField,
  UsernameFormField,
} from "../../components/FormField";
import { Snackbar } from "../../components/Snackbar";
import { ApiContext, AuthContext, makeUser } from "../../stores";
import { makeSettings } from "../../util/api";
import { API_KEY } from "../../util/constants";
import { teFold, teLeft, teRight } from "../../util/fp";
import { theme } from "../../util/theme";

const validationSchema = Yup.object({
  username: Yup.string().required().min(1),
  password: Yup.string().required().min(1),
});

interface FormValues {
  username: string;
  password: string;
}

const initialValues = { username: "", password: "" };

export const Login = (): React.ReactElement => {
  const { callPublic } = useContext(ApiContext);
  const { login } = useContext(AuthContext);

  const [isError, setError] = useState(false);

  const handleLogin = (values: FormValues) =>
    pipe(
      callPublic(Authentication.login)({
        value: {
          username: values.username,
          password: values.password,
          grant_type: "password",
          client_id: API_KEY,
        },
        settings: makeSettings(),
      }),
      teFold(
        (err: Error) => {
          setError(true);
          return teLeft(err);
        },
        (res) => {
          login(makeUser(values.username)(res));
          return teRight(res);
        }
      )
    )();

  return (
    <BackgroundCenter>
      <Logo />

      <Header>Welcome back.</Header>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {(formikProps) => {
          const { handleSubmit, isSubmitting, isValid } = formikProps;

          return (
            <>
              <UsernameFormField {...formikProps} />
              <PasswordFormField {...formikProps} />

              <Button
                mode="contained"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                onPress={handleSubmit}
              >
                Login
              </Button>
            </>
          );
        }}
      </Formik>

      <Surface style={styles.row}>
        <Caption>Non trovi il tuo account? Contatta il </Caption>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://grip.nexioapp.com/support");
          }}
        >
          <Caption style={styles.link}>supporto</Caption>
        </TouchableOpacity>
        <Caption>.</Caption>
      </Surface>

      <Snackbar
        visible={isError}
        onDismiss={() => {
          setError(false);
        }}
      >
        <Text>Coff coff, qualcosa è andato storto</Text>
      </Snackbar>
    </BackgroundCenter>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
