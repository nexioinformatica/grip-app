import { Body, Button, Header, Icon, Left, Right, Title } from "native-base";
import React from "react";

import { StackHeaderProps } from "@react-navigation/stack";

type AppBarProps = StackHeaderProps;

const AppBar = (props: AppBarProps): React.ReactElement => {
  const {
    navigation: { canGoBack, goBack, navigate },
  } = props;

  const BackButton = () => (
    <Button onPress={() => goBack()} transparent>
      <Icon name="arrow-back" />
    </Button>
  );

  const HomeButton = () => (
    <Button onPress={() => navigate("Home")} transparent>
      <Icon name="home" />
    </Button>
  );

  const title = props.scene.descriptor.options.title ?? props.scene.route.name;

  return (
    <Header>
      <Left>{canGoBack() ? <BackButton /> : <HomeButton />}</Left>
      <Body>
        <Title>{title}</Title>
      </Body>
      <Right>
        <Button transparent>
          <Icon name="person" onPress={() => navigate("Profile")} />
        </Button>
        <Button transparent>
          <Icon name="settings" />
        </Button>
      </Right>
    </Header>
  );
};

export { AppBar };
