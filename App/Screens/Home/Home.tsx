import React from "react";
import { StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Content, Button, Text, H1 } from "native-base";
import { SimpleCard } from "../../components";
import { ReasonTypeKey } from "../../types";

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
    navigation.navigate("NewMovement", {
      reasonTypeDefault: ReasonTypeKey.LoadRemnant,
    });
  };

  return (
    <>
      <Content padder>
        <SimpleCard>
          <H1>Azioni</H1>
          <Text>Inizia scegliendo una delle azioni elencate qui sotto.</Text>
        </SimpleCard>
        <SimpleCard>
          <StartProcessingButton
            full
            style={styles.action}
            onPress={handleStartProcessingButtonPress}
          />
          <ScrapToWarehouseButton
            full
            style={styles.action}
            onPress={handleScrapToWarehouseButtonPress}
          />
        </SimpleCard>
      </Content>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
  },
  action: {
    marginBottom: 5,
  },
});
