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

type AppBarProps = StackHeaderProps;

const AppBar = (props: AppBarProps) => {
  const { navigation } = props;
  const canGoBack = navigation.canGoBack();

  const BackButton = () => (
    <Button onPress={() => navigation.goBack()} transparent>
      <Icon name="arrow-back" />
    </Button>
  );

  const HomeButton = () => (
    <Button onPress={() => navigation.navigate("Home")} transparent>
      <Icon name="home" />
    </Button>
  );

  const title = props.scene.descriptor.options.title ?? props.scene.route.name;

  return (
    <Header>
      <Left>{canGoBack ? <BackButton /> : <HomeButton />}</Left>
      <Body>
        <Title>{title}</Title>
      </Body>
      <Right>
        <Button transparent>
          <Icon name="person" onPress={() => navigation.navigate("Profile")} />
        </Button>
        <Button transparent>
          <Icon name="settings" />
        </Button>
      </Right>
    </Header>
  );
};

export { AppBar };
