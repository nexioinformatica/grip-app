import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Barcode } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { ApiContext } from "../../stores/api";
import { BarcodeEvent } from "../../types";
import { makeSettings } from "../../util/api";
import { theme } from "../../util/theme";

type Props = React.ComponentProps<typeof TextInput> & {
  value?: string | undefined;
  onChangeText: (value: string | undefined) => void;
  onDecodeValue: (decodedValue: Barcode.BarcodeDecode) => void;
  errorText?: string;
};

/**
 * Collect user input as text or 2D code and provide the decoded object using
 * `barcode-decode` api.
 *
 * @param value The value for the input component.
 * @param onChangeText Callback for updating the input value.
 * @param onDecodeValue Callback providing the decoded value of the input value.
 */
export const ScanFreshman = ({
  value,
  onChangeText,
  onDecodeValue,
  errorText,
  ...rest
}: Props): React.ReactElement => {
  const navigation = useNavigation();
  const { callPublic } = useContext(ApiContext);

  const [isDecoding, setDecoding] = useState(false);
  const [isDecodingFailed, setDecodingFailed] = useState(false);

  const [statusIcon, setStatusIcon] = useState(<></>); // default icon setted in use effect

  const onDecodeError = (): T.Task<never> => {
    setDecoding(false);
    setDecodingFailed(true);
    return T.never;
  };

  const onDecodeSuccess = (
    res: Barcode.BarcodeDecode
  ): T.Task<Barcode.BarcodeDecode> => {
    setDecoding(false);
    setDecodingFailed(false);
    onDecodeValue(res);
    return T.of(res);
  };

  useEffect(() => {
    if (value) {
      setDecoding(true);
      pipe(
        callPublic(Barcode.decode)({
          value: { Code: value },
          settings: makeSettings(),
        }),
        TE.fold(onDecodeError, onDecodeSuccess)
      )();
    }
  }, [value]);

  const onIconPress = () =>
    navigation.navigate("Scan", {
      onBarcodeScanned: (barcodeEvent: BarcodeEvent) =>
        onChangeText(barcodeEvent.data),
    });

  useEffect(() => {
    if (isDecodingFailed)
      setStatusIcon(
        <TextInput.Icon
          name="alert-circle"
          onPress={() => {
            // we need to clean previous value in order to redo the barcode decode
            // if scanned item has the same barcode.
            onChangeText(undefined);
            onIconPress();
          }}
        />
      );

    if (isDecoding) setStatusIcon(<TextInput.Icon name="magnify" />);

    if (!isDecoding && !isDecodingFailed)
      setStatusIcon(<TextInput.Icon name="camera" onPress={onIconPress} />);
  }, [isDecoding, isDecodingFailed]);

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        right={statusIcon}
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...rest}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});
