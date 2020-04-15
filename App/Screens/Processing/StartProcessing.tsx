import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Button,
  Text,
} from "native-base";

type StartProcessingNavigationProp = StackNavigationProp<RootStackParamList>;
type StartProcessingProps = {
  navigation: StartProcessingNavigationProp;
};

export function StartProcessing(
  props: StartProcessingProps
): React.ReactElement {
  const { navigation } = props;

  return (
    <Content padder>
      <Card>
        <CardItem>
          <Body>
            <Text>StartProcessing</Text>
          </Body>
        </CardItem>
      </Card>
    </Content>
  );
}
