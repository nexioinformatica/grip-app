import React, { useState, useContext } from "react";
import { Container, Button, Text, Content, H1, H2 } from "native-base";
import { Input } from "react-native-elements";
import { StyleSheet, View } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../stores";
import * as E from "fp-ts/lib/Either";
import { ChooseOperator, SimpleCard } from "../../components";
import { Operator } from "../../types";

interface LoginProps {}

const validationSchema = Yup.object({
  username: Yup.string().required().min(4),
  password: Yup.string().required().min(4),
});

export const Login = (props: LoginProps): React.ReactElement => {
  const { login } = useContext(AuthContext);

  return (
    <Container>
      <Content padder>
        <SimpleCard>
          <H1>Login</H1>
          <Text>
            Scegli il tuo username ed inserisci la password. Se il tuo operatore
            non è presente puoi provare a digitare manualmente l'username
            nell'apposita casella di testo.
          </Text>
        </SimpleCard>
        <SimpleCard>
          <Formik
            initialValues={{ username: "", password: "test" }} // TODO: remove defaults
            validationSchema={validationSchema}
            onSubmit={(values) =>
              login(
                E.left({
                  username: values.username,
                  password: values.password,
                })
              )
            }
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              errors,
              isSubmitting,
              isValid,
              touched,
              setFieldValue,
              values,
            }) => {
              // TODO: use reflection to get props automatically (maybe?)
              const isTouched = touched.password || touched.username;
              return (
                <>
                  <View style={{ width: "100%" }}>
                    <H2>Operatori</H2>
                    <Field
                      name="username"
                      as={ChooseOperator}
                      onSelect={(x: Operator) =>
                        setFieldValue("username", x.UserName)
                      }
                    />
                    {/* <ChooseOperator
                      onSelect={(x) => setFieldValue("username", x.UserName)}
                    /> */}
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
