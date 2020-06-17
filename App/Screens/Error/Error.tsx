import React, { useContext } from "react";
import { Container, Button, Text, Content } from "native-base";
import { ErrorContext } from "../../stores";

export const Error = (): React.ReactElement => {
  const { error, setError } = useContext(ErrorContext);

  // Exit the error screen cleaning the error.
  const handleClear = () => setError(undefined);

  return (
    <Container>
      <Content padder>
        <Text>Errore</Text>
        <Text>{error?.message}</Text>
        <Button onPress={handleClear}>
          <Text>OK</Text>
        </Button>
      </Content>
    </Container>
  );
};
