import { BarCodeEvent } from "expo-barcode-scanner";
import React from "react";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { BarcodeScanner } from "../../components/BarcodeScanner";
import { noop } from "../../util/noop";
import { RootNavigatorParamList } from "../Navigators";

type Props = {
  navigation: StackNavigationProp<RootNavigatorParamList, "Scan">;
  route: RouteProp<RootNavigatorParamList, "Scan">;
};

export const Scan = (props: Props): React.ReactElement => {
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
