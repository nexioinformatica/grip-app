import { BarCodeEvent } from "expo-barcode-scanner";
import { Warehouse } from "geom-api-ts-client";
import { Container, Root } from "native-base";
import React, { useContext } from "react";
// import { DrawerContent } from "../components/Drawer";
import { Text, View } from "react-native";

// import { StartProcessing } from "./Processing";
// import { Scan } from "./Scan";.
// import { NewMovement } from "./Warehouse";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { DrawerContent } from "../components/Drawer";
import { AuthContext, ErrorContext } from "../stores";
import { Login, Profile } from "./Auth";
import { Error } from "./Error";
import { Home } from "./Home";
import { RootNavigator, LoginNavigator } from "./Navigators";

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

type RootDrawerParamList = {
  Home: undefined;
};

// const RootNavigator = ((): React.ReactElement => {
//   const Drawer = createDrawerNavigator<RootDrawerParamList>();

//   return (
// <>
//   <Drawer.Navigator
//     drawerContent={(props) => (
//       <View
//         style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
//       >
//         <Text>Exanoke</Text>
//       </View>
//     )}
//     // screenOptions={{
//     //   headerShown: true,
//     //   header: function appBar(props) {
//     //     return <AppBar {...props} />;
//     //   },
//     // }}
//   >
//     <Drawer.Screen name="Home" component={Home} />
//     {/* <Drawer.Screen
//       name="StartProcessing"
//       options={{ title: "Inizio Lavorazione" }}
//       component={StartProcessing}
//     />
//     <Drawer.Screen
//       name="NewMovement"
//       options={{ title: "Nuovo Movimento" }}
//       component={NewMovement}
//     />
//     <Drawer.Screen name="Scan" component={Scan} />
//     <Drawer.Screen
//       name="Profile"
//       component={Profile}
//       options={{ title: "Profilo" }}
//     /> */}
//   </Drawer.Navigator>
// </>
// );
// })();

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

const Screens = (): React.ReactElement => {
  // const { error } = useContext(ErrorContext);
  const { user } = useContext(AuthContext);

  // // Login Stack
  // if (!user())
  if (!user) return <LoginNavigator />;
  // return <NavigationContainer>{LoginStack}</NavigationContainer>;

  // // Error Stack
  // if (error) return ErrorStack;

  // Root Stack
  return <RootNavigator />;
};

export { Screens };
