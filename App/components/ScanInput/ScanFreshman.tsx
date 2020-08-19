import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { Input, InputProps } from "react-native-elements";
import { Spinner } from "native-base";
import { Icon } from "../Icon/Icon";
// import { BarcodeEvent, BarcodeDecode } from "../../types";
import { ApiContext } from "../../stores/api";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { Barcode } from "geom-api-ts-client";
import { AuthContext } from "../../stores";
import { makeSettings } from "../../util/api";
import { BarcodeEvent } from "../../types";

export interface ScanFreshmanProps extends InputProps {
  value?: string | undefined;
  onChangeValue: (value: string | undefined) => void;
  onDecodeValue: (decodedValue: Barcode.BarcodeDecode) => void;
}

/**
 * Collect user input as text or 2D code and provide the decoded object using
 * `barcode-decode` api.
 *
 * @param value The value for the input component.
 * @param onChangeValue Callback for updating the input value.
 * @param onDecodeValue Callback providing the decoded value of the input value.
 */
export const ScanFreshman = ({
  value,
  onChangeValue,
  onDecodeValue,
  ...rest
}: ScanFreshmanProps): React.ReactElement => {
  const navigation = useNavigation();
  const { callPublic } = useContext(ApiContext);

  const [isDecoding, setDecoding] = useState(false);
  const [isDecodingFailed, setDecodingFailed] = useState(false);

  const [statusIcon, setStatusIcon] = useState(<></>); // default icon setted in use effect

  const onDecodeError = (err: Error): T.Task<never> => {
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
        onChangeValue(barcodeEvent.data),
    });

  useEffect(() => {
    if (isDecodingFailed)
      setStatusIcon(
        <Icon
          name="alert-circle"
          onPress={() => {
            // we need to clean previous value in order to redo the barcode decode
            // if scanned item has the same barcode.
            onChangeValue(undefined);
            onIconPress();
          }}
        />
      );

    if (isDecoding) setStatusIcon(<Spinner />);

    if (!isDecoding && !isDecodingFailed)
      setStatusIcon(<Icon name="camera" onPress={onIconPress} />);
  }, [isDecoding, isDecodingFailed]);

  return (
    <Input
      value={value}
      onChangeText={onChangeValue}
      rightIcon={statusIcon}
      containerStyle={{ width: "100%" }}
      {...rest}
    />
  );
};
