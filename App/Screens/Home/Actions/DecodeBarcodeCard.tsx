import { View } from "native-base";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  Button,
  Card,
  Dialog,
  Paragraph,
  Portal,
  Text,
  Title,
} from "react-native-paper";

import { ScanFreshman } from "../../../components/ScanInput";
import { BarcodeDecode } from "../../../types/Barcode";

const DecodeBarcodeCard = () => {
  const [isVisible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);

  const [barcode, setBarcode] = useState("");
  const [barcodeData, setBarcodeData] = useState<BarcodeDecode>([]);

  const handleDecodeValue = (decoded: BarcodeDecode) => {
    setBarcodeData(decoded);
    showDialog();
  };

  return (
    <>
      <Card>
        <Card.Content>
          <Title>Decodifica</Title>
          <Paragraph>
            Visualizza le informazioni relative ad un barcode.
          </Paragraph>
          <ScanFreshman
            label="Barcode"
            onChangeText={(x?: string) => setBarcode(x ?? "")}
            onDecodeValue={handleDecodeValue}
            value={barcode}
            returnKeyType="send"
            keyboardType="default"
            disabled={true}
          />
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={isVisible} onDismiss={hideDialog}>
          <Dialog.Title>Barcode Decode</Dialog.Title>
          <Dialog.Content>
            <View style={{ height: 200, marginTop: 24 }}>
              {barcodeData.map((x, i) => {
                return (
                  <View style={styles.mt16} key={i}>
                    <Title>{barcode}</Title>
                    <Text>Tipo: {x.Tipo}</Text>
                    <Text>Contenuto: {JSON.stringify(x.Oggetto)}</Text>
                  </View>
                );
              })}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Chiudi</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const DecodeBarcodeCardMemo = React.memo(DecodeBarcodeCard);

export { DecodeBarcodeCardMemo as DecodeBarcodeCard };

const styles = StyleSheet.create({
  mt16: {
    marginTop: 16,
  },
});
