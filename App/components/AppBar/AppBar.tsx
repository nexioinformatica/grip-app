import React, { useEffect, useState, useContext } from "react";
import {
  Header,
  Body,
  Title,
  Right,
  Button,
  Icon,
  Left,
  Text,
} from "native-base";
import { StackHeaderProps } from "@react-navigation/stack";
import { AuthData, AuthContext } from "../../stores";

type AppBarProps = StackHeaderProps;

const AppBar = (props: AppBarProps) => {
  const { navigation } = props;
  const { logout } = useContext(AuthContext);
  const canGoBack = navigation.canGoBack();

  const BackButton = () => (
    <Button onPress={() => navigation.goBack()}>
      <Icon name="arrow-back" />
    </Button>
  );

  const HomeButton = () => (
    <Button onPress={() => navigation.navigate("Home")}>
      <Icon name="home" />
    </Button>
  );

  return (
    <Header>
      <Left>{canGoBack ? <BackButton /> : <HomeButton />}</Left>
      <Body>
        <Title>{props.scene.route.name}</Title>
      </Body>
      <Right>
        <Button transparent>
          <Icon name="person" onPress={() => logout()} />
        </Button>
        <Button transparent>
          <Icon name="settings" />
        </Button>
      </Right>
    </Header>
  );
};

export { AppBar };
