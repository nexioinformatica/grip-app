import { Field, Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Authentication, Operator } from "geom-api-ts-client";
import { Button, Container, Content, H1, H2, Text, Toast } from "native-base";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "react-native-elements";
import * as Yup from "yup";

import { ChooseOperator, SimpleCard } from "../../components";
import { AuthContext, makeUser } from "../../stores";
import { logErrorIfAny, makeSettings } from "../../util/api";
import { API_KEY } from "../../util/constants";
import { generalErrorToast } from "../../util/ui";

const validationSchema = Yup.object({
  username: Yup.string().required().min(4),
  password: Yup.string().required().min(4),
});

export const Login = (): React.ReactElement => {
  const { login } = useContext(AuthContext);

  return (
    <Container>
      <Content padder>
        <SimpleCard>
          <H1>Login</H1>
          <Text>
            Scegli il tuo username ed inserisci la password. Se il tuo operatore
            non è presente puoi provare a digitare manualmente l&apos;username
            nell&apos;apposita casella di testo.
          </Text>
        </SimpleCard>
        <SimpleCard>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) =>
              pipe(
                Authentication.login({
                  value: {
                    username: values.username,
                    password: values.password,
                    grant_type: "password",
                    client_id: API_KEY,
                  },
                  settings: makeSettings(),
                }),
                logErrorIfAny,
                TE.fold(
                  () => {
                    Toast.show(generalErrorToast);
                    return T.never;
                  },
                  (res) => {
                    login(makeUser(values.username)(res));
                    return T.of(res);
                  }
                )
              )()
            }
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              errors,
              isSubmitting,
              isValid,
              setFieldValue,
              values,
            }) => {
              return (
                <>
                  <View style={{ width: "100%" }}>
                    <H2>Operatori</H2>
                    <Field
                      name="username"
                      as={ChooseOperator}
                      onSelect={(x: Operator.Operator) =>
                        setFieldValue("username", x.UserName)
                      }
                    />
                  </View>

                  <View style={{ marginTop: 20, width: "100%" }}>
                    <H2>Credenziali</H2>
                    <View style={styles.item}>
                      <Field
                        name="username"
                        as={Input}
                        placeholder="Username"
                        onChangeText={handleChange("username")}
                        value={values.username}
                        onBlur={handleBlur("username")}
                        errorMessage={errors.username}
                      />
                    </View>
                    <View style={styles.last}>
                      <Field
                        name="password"
                        as={Input}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        placeholder="Password"
                        secureTextEntry={true}
                        errorMessage={errors.password}
                      />
                    </View>

                    <View>
                      <Button
                        full
                        primary
                        onPress={handleSubmit}
                        disabled={isSubmitting || !isValid}
                      >
                        <Text>Login</Text>
                      </Button>
                    </View>
                  </View>
                </>
              );
            }}
          </Formik>
        </SimpleCard>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 0,
  },
  last: {
    marginBottom: 10,
  },
});
