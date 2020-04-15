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
import { Col, Row, Grid } from "react-native-easy-grid";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type HomeProps = {
  navigation: HomeScreenNavigationProp;
};

const StartProcessingButton = (props: any) => {
  return (
    <Button {...props}>
      <Text>Inizio Lavorazione</Text>
    </Button>
  );
};

const ScrapToWarehouseButton = (props: any) => {
  return (
    <Button {...props}>
      <Text>Scarto a Magazzino</Text>
    </Button>
  );
};

export function Home(props: HomeProps): React.ReactElement {
  const { navigation } = props;

  const handleStartProcessingButtonPress = () => {
    navigation.navigate("StartProcessing");
  };

  const handleScrapToWarehouseButtonPress = () => {
    navigation.navigate("ScrapToWarehouse");
  };

  return (
    <>
      <Content padder>
        <Card>
          <CardItem>
            <Body>
              <StartProcessingButton
                full
                onPress={handleStartProcessingButtonPress}
              />
              <ScrapToWarehouseButton
                full
                style={{ marginTop: 20 }}
                onPress={() => handleScrapToWarehouseButtonPress()}
              />
            </Body>
          </CardItem>
        </Card>
      </Content>
    </>
  );
}
