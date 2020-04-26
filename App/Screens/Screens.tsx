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
import { Login, Profile } from "./Auth";
import { ErrorContext, AuthContext, AuthData } from "../stores";

export type RootStackParamList = {
  Home: undefined;
  StartProcessing: undefined;
  ScrapToWarehouse: undefined;
  Scan: { onBarcodeScanned?: (barcode: BarCodeEvent) => void };
  Profile: undefined;
};

const RootStack = (() => {
  const Stack = createStackNavigator<RootStackParamList>();
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          header: (props) => <AppBar {...props} />,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="StartProcessing" component={StartProcessing} />
        <Stack.Screen name="ScrapToWarehouse" component={ScrapToWarehouse} />
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Profile" component={Profile} options={{title: "Profilo"}} />
      </Stack.Navigator>
    </>
  );
})();

const LoginStack = (() => <Login />)();

const ErrorStack = (error: Error) => {
  return <Text>Si è verificato un errore! (Messaggio: {error.message})</Text>;
};

const renderScreens = (auth?: AuthData, error?: Error) => {
  if (error) return ErrorStack(error);

  if (!auth) return LoginStack;

  return RootStack;
};

const Screens = (): React.ReactElement => {
  const { error } = useContext(ErrorContext);
  const { auth } = useContext(AuthContext);

  return (
    <Container style={{ backgroundColor: "red", flex: 1 }}>
      <NavigationContainer>{renderScreens(auth, error)}</NavigationContainer>
    </Container>
  );
};

export { Screens };
