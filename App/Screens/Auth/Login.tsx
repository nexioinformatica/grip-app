import React, { useState, useContext } from "react";
import {
  Container,
  Header,
  Button,
  Text,
  Body,
  Form,
  Item as FormItem,
  Label,
  Title,
  Content,
  Item,
} from "native-base";
import { Input } from "react-native-elements";
import Constants from "expo-constants";
import {
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../stores";

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
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => login(values.username, values.password)}
        >
          {({ handleSubmit, errors, isSubmitting, isValid, touched }) => {
            // TODO: use reflection to get props automatically (maybe?)
            const isTouched = touched.password || touched.username;
            return (
              <>
                <View style={styles.item}>
                  <Field
                    name="username"
                    placeholder="Username"
                    as={Input}
                    errorMessage={errors.username}
                  />
                </View>
                <View style={styles.last}>
                  <Field
                    name="password"
                    placeholder="Password"
                    as={Input}
                    secureTextEntry={true}
                    errorMessage={errors.password}
                  />
                </View>

                <View>
                  <Button
                    full
                    primary
                    onPress={handleSubmit}
                    disabled={!isTouched || isSubmitting || !isValid}
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
