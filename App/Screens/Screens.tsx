import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AppBar } from "../components";
import { Home } from "./Home";
import { Container, Root } from "native-base";
import { StartProcessing } from "./Processing";
import { NewMovement } from "./Warehouse";
import { BarCodeEvent } from "expo-barcode-scanner";
import { Scan } from "./Scan";
import { Login, Profile } from "./Auth";
import { ErrorContext, AuthContext } from "../stores";
import { Error } from "./Error";
import { Warehouse } from "geom-api-ts-client";

export type RootStackParamList = {
  Home: undefined;
  StartProcessing: undefined;
  NewMovement: {
    reasonTypeDefault: Warehouse.Movement.ReasonTypeKey | undefined;
  };
  Scan: { onBarcodeScanned?: (barcode: BarCodeEvent) => void };
  Profile: undefined;
};

export type LoginStackParamList = {
  Login: undefined;
};

export type ErrorStackParamList = {
  Error: { error: Error; onClear: () => void };
};

const RootStack = ((): React.ReactElement => {
  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          header: function appBar(props) {
            return <AppBar {...props} />;
          },
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="StartProcessing"
          options={{ title: "Inizio Lavorazione" }}
          component={StartProcessing}
        />
        <Stack.Screen
          name="NewMovement"
          options={{ title: "Nuovo Movimento" }}
          component={NewMovement}
        />
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

const LoginStack = ((): React.ReactElement => {
  const Stack = createStackNavigator<LoginStackParamList>();

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </>
  );
})();

const ErrorStack = ((): React.ReactElement => {
  const Stack = createStackNavigator<ErrorStackParamList>();

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Error" component={Error} />
      </Stack.Navigator>
    </>
  );
})();

/**
 * Wrap content into the basic structure.
 * @param children The content to wrap.
 */
const wrap = (children: any): React.ReactElement => {
  return (
    <Root>
      <Container style={{ flex: 1 }}>
        <NavigationContainer>{children}</NavigationContainer>
      </Container>
    </Root>
  );
};

const Screens = (): React.ReactElement => {
  const { error } = useContext(ErrorContext);
  const { user } = useContext(AuthContext);

  // Login Stack
  if (!user()) return wrap(LoginStack);

  // Error Stack
  if (error) return wrap(ErrorStack);

  // Root Stack
  return wrap(RootStack);
};

export { Screens };
