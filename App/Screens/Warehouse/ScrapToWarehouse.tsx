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

type ScrapToWarehouseNavigationProp = StackNavigationProp<RootStackParamList>;
type ScrapToWarehouseProps = {
  navigation: ScrapToWarehouseNavigationProp;
};

export function ScrapToWarehouse(
  props: ScrapToWarehouseProps
): React.ReactElement {
  const { navigation } = props;

  return (
    <Content padder>
      <Card>
        <CardItem>
          <Body>
            <Text>ScrapToWarehouse</Text>
          </Body>
        </CardItem>
      </Card>
    </Content>
  );
}
