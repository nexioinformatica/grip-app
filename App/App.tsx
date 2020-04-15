import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  Body,
  Title,
  Text,
  Right,
  Button,
  Icon,
} from "native-base";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

const App = () => {
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    (async function () {
      await Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        ...Ionicons.font,
      });
    })();
    setReady(true);
  }, [setReady]);

  return isReady ? (
    <Container>
      <Header>
        <Body>
          <Title>Header</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon name="search" />
          </Button>
          <Button transparent>
            <Icon name="heart" />
          </Button>
          <Button transparent>
            <Icon name="more" />
          </Button>
        </Right>
      </Header>
      <Text>Welcome to Grip App</Text>
    </Container>
  ) : (
    <Text>Not ready!</Text>
  );
};

export { App };
