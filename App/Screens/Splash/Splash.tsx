import React from "react";
import { Container, Content, Spinner } from "native-base";

type Props = {
  navigation: Navigation;
};

export function Splash(): React.ReactElement {
  return (
    <Background>
      <Logo />
      <Header>Login Template</Header>

      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Sign Up
      </Button>
    </Background>
  );
}
