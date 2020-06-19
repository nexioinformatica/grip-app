import React from "react";
import { Container, Content, Spinner } from "native-base";

export function Splash(): React.ReactElement {
  return (
    <Container>
      <Content>
        <Spinner />
      </Content>
    </Container>
  );
}
