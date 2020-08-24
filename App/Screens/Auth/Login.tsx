// import { Field, Formik } from "formik";
// import { pipe } from "fp-ts/lib/pipeable";
// import * as T from "fp-ts/lib/Task";
// import * as TE from "fp-ts/lib/TaskEither";
// import { Authentication, Operator } from "geom-api-ts-client";
// import React, { useContext } from "react";
// import { StyleSheet, View, Text } from "react-native";
// import { Input } from "react-native-elements";
// import * as Yup from "yup";

// import { ChooseOperator, SimpleCard } from "../../components";
// import { AuthContext, makeUser, ApiContext } from "../../stores";
// import { makeSettings } from "../../util/api";
// import { API_KEY } from "../../util/constants";
// import { generalErrorToast } from "../../util/ui";

// const validationSchema = Yup.object({
//   username: Yup.string().required().min(4),
//   password: Yup.string().required().min(4),
// });

// export const Login = (): React.ReactElement => {
//   const { callPublic } = useContext(ApiContext);
//   const { login } = useContext(AuthContext);

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>Home Screen</Text>
//     </View>
// <Container>
//   <Content padder>
//     <SimpleCard>
//       <H1>Login</H1>
//       <Text>
//         Scegli il tuo username ed inserisci la password. Se il tuo operatore
//         non è presente puoi provare a digitare manualmente l&apos;username
//         nell&apos;apposita casella di testo.
//       </Text>
//     </SimpleCard>
//     <SimpleCard>
//       <Formik
//         initialValues={{ username: "", password: "" }}
//         validationSchema={validationSchema}
//         onSubmit={(values) =>
//           pipe(
//             callPublic(Authentication.login)({
//               value: {
//                 username: values.username,
//                 password: values.password,
//                 grant_type: "password",
//                 client_id: API_KEY,
//               },
//               settings: makeSettings(),
//             }),
//             TE.fold(
//               () => {
//                 Toast.show(generalErrorToast);
//                 return T.never;
//               },
//               (res) => {
//                 login(makeUser(values.username)(res));
//                 return T.of(res);
//               }
//             )
//           )()
//         }
//       >
//         {({
//           handleSubmit,
//           handleChange,
//           handleBlur,
//           errors,
//           isSubmitting,
//           isValid,
//           setFieldValue,
//           values,
//         }) => {
//           return (
//             <>
//               <View style={{ width: "100%" }}>
//                 <H2>Operatori</H2>
//                 <Field
//                   name="username"
//                   as={ChooseOperator}
//                   onSelect={(x: Operator.Operator) =>
//                     setFieldValue("username", x.UserName)
//                   }
//                 />
//               </View>

//               <View style={{ marginTop: 20, width: "100%" }}>
//                 <H2>Credenziali</H2>
//                 <View style={styles.item}>
//                   <Input
//                     placeholder="Username"
//                     onChangeText={handleChange("username")}
//                     value={values.username}
//                     onBlur={handleBlur("username")}
//                     errorMessage={errors.username}
//                   />
//                 </View>
//                 <View style={styles.last}>
//                   <Input
//                     onChangeText={handleChange("password")}
//                     onBlur={handleBlur("password")}
//                     placeholder="Password"
//                     secureTextEntry={true}
//                     errorMessage={errors.password}
//                   />
//                 </View>

//                 <View>
//                   <Button
//                     full
//                     primary
//                     onPress={handleSubmit}
//                     disabled={isSubmitting || !isValid}
//                   >
//                     <Text>Login</Text>
//                   </Button>
//                 </View>
//               </View>
//             </>
//           );
//         }}
//       </Formik>
//     </SimpleCard>
//   </Content>
// </Container>
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     marginBottom: 0,
//   },
//   last: {
//     marginBottom: 10,
//   },
// });

import { Formik } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Authentication, Operator } from "geom-api-ts-client";
import React, { useContext, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import {
  Dialog,
  Portal,
  List,
  Checkbox,
  TouchableRipple,
  Avatar,
} from "react-native-paper";
import * as Yup from "yup";

import {
  Background,
  Button,
  Header,
  Logo,
  TextInput,
  TextInputIcon,
} from "../../components/Auth";
import { Paragraph } from "../../components/Auth/Paragraph";
import { ApiContext, AuthContext, makeUser } from "../../stores";
import { makeSettings } from "../../util/api";
import { API_KEY } from "../../util/constants";
import { teFold, tNever, tOf } from "../../util/fp";
import { theme } from "../../util/theme";
import { OperatorList } from "../../components/ChooseOperator/OperatorList";

const validationSchema = Yup.object({
  username: Yup.string().required().min(1),
  password: Yup.string().required().min(1),
});

interface FormValues {
  username: string;
  password: string;
}

const initialValues = { username: "", password: "" };

export const Login = () => {
  const { callPublic } = useContext(ApiContext);
  const { login } = useContext(AuthContext);

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
        () => {
          // Toast.show(generalErrorToast);
          return tNever;
        },
        (res) => {
          login(makeUser(values.username)(res));
          return tOf(res);
        }
      )
    )();

  const [isVisible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);

  return (
    <Background>
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
                onPress={handleSubmit}
              >
                Login
              </Button>

              <Portal>
                <Dialog visible={isVisible} onDismiss={hideDialog}>
                  <Dialog.Title>Operatore</Dialog.Title>
                  <Dialog.Content>
                    <Text>
                      Scegli un'operatore dalla lista, verrà utilizzato il nome
                      utente per il login.
                    </Text>
                    <View style={{ height: 200, marginTop: 24 }}>
                      <OperatorList
                        onSelectedValue={(operator) =>
                          handleChange("username")(operator.UserName ?? "")
                        }
                      />
                    </View>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={hideDialog}>Chiudi</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </>
          );
        }}
      </Formik>

      <View style={styles.row}>
        <Text style={styles.label}>Non trovi il tuo account? Contatta il </Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://grip.nexioapp.com/support");
          }}
        >
          <Text style={styles.link}>supporto</Text>
        </TouchableOpacity>
        <Text>.</Text>
      </View>
    </Background>
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
