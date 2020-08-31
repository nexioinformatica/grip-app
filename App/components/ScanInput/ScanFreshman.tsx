import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Barcode } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { ApiContext } from "../../stores/api";
import { BarcodeEvent } from "../../types";
import { makeSettings } from "../../util/api";
import { TextInput, TextInputIcon } from "../TextInput";

type Props = React.ComponentProps<typeof TextInput> & {
  value?: string | undefined;
  onChangeText: (value: string | undefined) => void;
  onDecodeValue: (decodedValue: Barcode.BarcodeDecode) => void;
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
  const theme = useTheme();
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
        <TextInputIcon
          name="alert-circle"
          onPress={() => {
            // we need to clean previous value in order to redo the barcode decode
            // if scanned item has the same barcode.
            onChangeText(undefined);
            onIconPress();
          }}
        />
      );

    if (isDecoding) setStatusIcon(<TextInputIcon name="magnify" />);

    if (!isDecoding && !isDecodingFailed)
      setStatusIcon(<TextInputIcon name="camera" onPress={onIconPress} />);
  }, [isDecoding, isDecodingFailed]);

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
