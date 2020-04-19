import React, { useEffect } from "react";
import {
  StackNavigationProp,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
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
import { BarcodeScanner } from "../../components";
import { BarCodeEvent } from "expo-barcode-scanner";
import { noop } from "../../util/noop";

type ScanNavigationProp = StackNavigationProp<RootStackParamList, "Scan">;
type ScanRouteProp = RouteProp<RootStackParamList, "Scan">;
// type T = StackNavigationOptions;
type ScanProps = {
  navigation: ScanNavigationProp;
  route: ScanRouteProp;
};

export const Scan = (props: ScanProps): React.ReactElement => {
  const { navigation, route } = props;

  // Need to check
  // - route.params is not undefined
  // - route.params.onBarcodeScanned is not undefined
  const onBarcodeScanned = route.params
    ? route.params.onBarcodeScanned
      ? route.params.onBarcodeScanned
      : noop
    : noop;

  const handleBarcodeScanned = (barcodeEvent: BarCodeEvent) => {
    onBarcodeScanned(barcodeEvent);
    navigation.goBack();
  };

  return <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />;
};
