import { Warehouse } from "geom-api-ts-client";
// import { Button, Content, H1, Text, NativeBase } from "native-base";
import React from "react";
import { StyleSheet, Text } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";

import { SimpleCard } from "../../components";
import { RootStackParamList } from "../Screens";
import { StackNavigatorParamlist } from "../Stacks";
import { Button } from "react-native-paper";

type HomeScreenNavigationProp = StackNavigationProp<StackNavigatorParamlist>;
type HomeProps = {
  navigation: HomeScreenNavigationProp;
};

// const StartProcessingButton = (props: NativeBase.Button) => {
//   return (
//     <Button {...props}>
//       <Text>Inizio Lavorazione</Text>
//     </Button>
//   );
// };

// const ScrapToWarehouseButton = (props: NativeBase.Button) => {
//   return (
//     <Button {...props}>
//       <Text>Scarto a Magazzino</Text>
//     </Button>
//   );
// };

export function Home(props: HomeProps): React.ReactElement {
  const { navigation } = props;

  // const handleStartProcessingButtonPress = () => {
  //   navigation.navigate("StartProcessing");
  // };

  // const handleScrapToWarehouseButtonPress = () => {
  //   navigation.navigate("NewMovement", {
  //     reasonTypeDefault: Warehouse.Movement.ReasonTypeKey.LoadRemnant,
  //   });
  // };

  return (
    <>
      <Text>Home</Text>
      <Button onPress={() => navigation.navigate("Example")}>
        <Text>Click</Text>
      </Button>
      {/* <Content padder>
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
      </Content> */}
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
