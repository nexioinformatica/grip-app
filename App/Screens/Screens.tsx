import React, { useContext } from "react";
import { StatusBar, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AppBar } from "../components";
import { Home } from "./Home";
import { Container, Content } from "native-base";
import { StartProcessing } from "./Processing";
import { ScrapToWarehouse } from "./Warehouse";
import { BarCodeEvent } from "expo-barcode-scanner";
import { Scan } from "./Scan";

export type RootStackParamList = {
  Home: undefined;
  StartProcessing: undefined;
  ScrapToWarehouse: undefined;
  Scan: { onBarcodeScanned?: (barcode: BarCodeEvent) => void };
};

const Stack = createStackNavigator<RootStackParamList>();

const Screens = (): React.ReactElement => {
  const auth = true;

  return (
    <Container style={{ backgroundColor: "red", flex: 1 }}>
      <NavigationContainer>
        {(auth && (
          <>
            <Stack.Navigator
              screenOptions={{
                headerShown: true,
                header: (props) => <AppBar {...props} />,
              }}
            >
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen
                name="StartProcessing"
                component={StartProcessing}
              />
              <Stack.Screen
                name="ScrapToWarehouse"
                component={ScrapToWarehouse}
              />
              <Stack.Screen name="Scan" component={Scan} />
            </Stack.Navigator>
          </>
        )) || (
          <>
            <Text>Auth required!</Text>
          </>
        )}
      </NavigationContainer>
    </Container>
  );
};

export { Screens };
