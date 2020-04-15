import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Container, Content, Spinner } from "native-base";

interface SpashProps {}

export function Splash(props: SpashProps): React.ReactElement {
  return (
    <Container>
      <Content>
        <Spinner />
      </Content>
    </Container>
  );
}
