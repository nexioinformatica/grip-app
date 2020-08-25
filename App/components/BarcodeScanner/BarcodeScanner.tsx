import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { noop } from "../../util/noop";
import { Button } from "react-native-paper";

export interface BarcodeScannerProps {
  onBarcodeScanned?: (barcodeEvent: BarCodeEvent) => void;
}

export type BarcodeEvent = BarCodeEvent;

export const BarcodeScanner = ({
  onBarcodeScanned,
}: BarcodeScannerProps): React.ReactElement => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState<BarCodeEvent | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = (barcodeEvent: BarCodeEvent) => {
    setScanned(true);
    setBarcode(barcodeEvent);
    if (onBarcodeScanned) onBarcodeScanned(barcodeEvent);
    else {
      const { type, data } = barcodeEvent;
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? noop : handleBarCodeScanned}
      style={StyleSheet.absoluteFill}
    >
      <View style={styles.layerTop} />
      <View style={styles.layerCenter}>
        <View style={styles.layerLeft} />
        <View style={styles.focused} />
        <View style={styles.layerRight} />
      </View>
      <View style={styles.layerBottom} />
      {scanned && (
        <View style={styles.result}>
          <Text style={{ padding: 10 }}>{barcode ? barcode.data : ""}</Text>
          <Button mode="outlined" onPress={() => setScanned(false)}>
            Scansiona di nuovo
          </Button>
        </View>
      )}
    </BarCodeScanner>
  );
};

const opacity = "rgba(0, 0, 0, .6)";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#000",
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 2,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity,
  },
  result: {
    backgroundColor: "white",
  },
});
