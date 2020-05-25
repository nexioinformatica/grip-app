import React, { useState, useContext } from "react";
import { Container, Button, Text, Content } from "native-base";
import { Input } from "react-native-elements";
import { StyleSheet, View } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../stores";
import * as E from "fp-ts/lib/Either";

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
        <Formik
          initialValues={{ username: "test", password: "test" }} // TODO: remove defaults
          validationSchema={validationSchema}
          onSubmit={(values) =>
            login(
              E.left({ username: values.username, password: values.password })
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
          }) => {
            // TODO: use reflection to get props automatically (maybe?)
            const isTouched = touched.password || touched.username;
            return (
              <>
                <View style={styles.item}>
                  <Field
                    name="username"
                    as={Input}
                    placeholder="Username"
                    onChangeText={handleChange("username")}
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
              </>
            );
          }}
        </Formik>
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
