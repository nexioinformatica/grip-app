import React, { useContext } from "react";
import { Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AppBar } from "../components";
import { Home } from "./Home";
import { Container, Button } from "native-base";
import { StartProcessing } from "./Processing";
import { ScrapToWarehouse } from "./Warehouse";
import { BarCodeEvent } from "expo-barcode-scanner";
import { Scan } from "./Scan";
import { Login, Profile } from "./Auth";
import { ErrorContext, AuthContext } from "../stores";
import { User } from "../types";

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
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profilo" }}
        />
      </Stack.Navigator>
    </>
  );
})();

const LoginStack = (() => <Login />)();

const ErrorStack = (
  error: Error,
  setError: (err: Error | undefined) => void
) => {
  console.error(error);
  return (
    <>
      <Text>Si è verificato un errore!</Text>
      <Button onPress={() => setError(undefined)}>
        <Text>Ok</Text>
      </Button>
      <Text>Nome: {error.name}</Text>
      <Text>Messaggio: {error.message}</Text>
      <Text>{error.stack}</Text>
    </>
  );
};

const renderScreens = () => {
  const { error, setError } = useContext(ErrorContext);
  const { user } = useContext(AuthContext);

  if (error) return ErrorStack(error, setError);

  if (!user) return LoginStack;

  return RootStack;
};

const Screens = (): React.ReactElement => {
  return (
    <Container style={{ backgroundColor: "red", flex: 1 }}>
      <NavigationContainer>{renderScreens()}</NavigationContainer>
    </Container>
  );
};

export { Screens };
