import { Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Authentication } from "geom-api-ts-client";
import React, { useContext, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { Caption, Dialog, Portal, Surface, Text } from "react-native-paper";
import * as Yup from "yup";

import { Snackbar } from "../../components/Snackbar";
import { BackgroundCenter, Button, Header, Logo } from "../../components/Auth";
import { OperatorList } from "../../components/ChooseOperator";
import { TextInput, TextInputIcon } from "../../components/TextInput";
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

  const [isVisible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);

  return (
    <BackgroundCenter>
      <Logo />

      <Header>Welcome back.</Header>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          errors,
          isSubmitting,
          isValid,
          values,
        }) => {
          return (
            <>
              <TextInput
                label="Username"
                returnKeyType="next"
                value={values.username}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                error={!!errors.username}
                errorText={errors.username}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="username"
                keyboardType="default"
                right={
                  <TextInputIcon onPress={showDialog} name="account-circle" />
                }
              />

              <TextInput
                label="Password"
                returnKeyType="done"
                value={values.password}
                onChangeText={handleChange("password")}
                error={!!errors.password}
                errorText={errors.password}
                secureTextEntry
              />

              <Button
                mode="contained"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                onPress={handleSubmit}
              >
                Login
              </Button>

              <Portal>
                <Dialog visible={isVisible} onDismiss={hideDialog}>
                  <Surface style={{ elevation: 0 }}>
                    <Dialog.Title>Operatore</Dialog.Title>
                    <Dialog.Content>
                      <Text>
                        Scegli un&apos;operatore dalla lista, verrà utilizzato
                        il nome utente per il login.
                      </Text>
                      <Surface style={{ height: 200, marginTop: 24 }}>
                        <OperatorList
                          onSelectedValue={(operator) => {
                            hideDialog();
                            handleChange("username")(operator.UserName ?? "");
                          }}
                        />
                      </Surface>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={hideDialog}>Chiudi</Button>
                    </Dialog.Actions>
                  </Surface>
                </Dialog>
              </Portal>
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
