import React, { useContext } from "react";
import { StatusBar, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AppBar } from "../components";
import { Home } from "./Home";
import { Container } from "native-base";
import { StartProcessing } from "./Processing";
import { ScrapToWarehouse } from "./Warehouse";

export type RootStackParamList = {
  Home: undefined;
  StartProcessing: undefined;
  ScrapToWarehouse: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Screens = (): React.ReactElement => {
  const auth = true;

  return (
    <Container style={{ backgroundColor: "red" }}>
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
            </Stack.Navigator>
          </>
        )) || <></>}
      </NavigationContainer>
    </Container>
  );
};

export { Screens };
