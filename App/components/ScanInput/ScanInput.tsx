import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { BarcodeEvent } from "../../types";
import { TextInput, TextInputIcon } from "../TextInput";

enum DecodeStatus {
  Ready,
  Decoding,
  Failed,
}

type Props<T> = React.ComponentProps<typeof TextInput> & {
  value?: string | undefined;
  onChangeText: (value: string | undefined) => void;
  onDecodeValue: (decodedValue: T) => void;
  decode: (value: string) => Promise<T>;
};

const DecodingStatusIcon = () => <TextInputIcon name="magnify" />;

const ReadyStatusIcon = (onPress: () => void) => (
  <TextInputIcon name="camera" onPress={onPress} />
);

const FailedStatusIcon = ReadyStatusIcon;
/**
 * Collect user input as text or 2D code and provide the decoded object using
 * `barcode-decode` api.
 *
 * @param value The value for the input component.
 * @param onChangeText Callback for updating the input value.
 * @param onDecodeValue Callback providing the decoded value of the input value.
 */
export const ScanInput = <T,>({
  value,
  onChangeText,
  onDecodeValue,
  decode,
  errorText,
  ...rest
}: Props<T>): React.ReactElement => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [status, setStatus] = useState<DecodeStatus>(DecodeStatus.Ready);
  const [statusIcon, setStatusIcon] = useState(<></>);

  const decodeValue = (value: string): Promise<T> =>
    decode(value).then((decoded) => {
      onDecodeValue(decoded);
      return decoded;
    });

  const scanOnIconPress = () =>
    navigation.navigate("Scan", {
      onBarcodeScanned: (barcodeEvent: BarcodeEvent) =>
        onChangeText(barcodeEvent.data),
    });

  const retryOnIconPress = () => {
    // we need to clean previous value in order to redo the barcode decode
    // if scanned item has the same barcode.
    onChangeText(undefined);
    scanOnIconPress();
  };

  const setDecodingStatusIcon = () => setStatusIcon(DecodingStatusIcon());
  const setReadyStatusIcon = () =>
    setStatusIcon(ReadyStatusIcon(scanOnIconPress));
  const setFailedStatusIcon = () =>
    setStatusIcon(FailedStatusIcon(retryOnIconPress));

  const handleValueChange = (value?: string): void => {
    if (!value) return;

    setStatus(DecodeStatus.Decoding);

    decodeValue(value)
      .then(() => setStatus(DecodeStatus.Ready))
      .catch(() => setStatus(DecodeStatus.Failed));
  };

  const handleStatusChange = (status: DecodeStatus) => {
    if (status === DecodeStatus.Failed) setFailedStatusIcon();
    else if (status === DecodeStatus.Decoding) setDecodingStatusIcon();
    else setReadyStatusIcon();
  };

  useEffect(() => handleValueChange(value), [value]);
  useEffect(() => handleStatusChange(status), [status]);

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      right={statusIcon}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      errorText={errorText}
      {...rest}
    />
  );
};
