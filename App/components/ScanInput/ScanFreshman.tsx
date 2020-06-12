import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { Input, InputProps } from "react-native-elements";
import { View } from "react-native";
import { Spinner, Toast, Text } from "native-base";
import { Icon } from "../Icon/Icon";
import { noop } from "../../util/noop";
import { ScanInputProps } from "./ScanInput";
import { BarcodeEvent, BarcodeDecode } from "../../types";
import { ApiContext } from "../../stores/api";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { log } from "../../util/fp";

export interface ScanFreshmanProps extends InputProps {
  value?: string | undefined;
  onChangeValue: (value: string | undefined) => void;
  onValueDecoded: (decodedValue: BarcodeDecode) => void;
}

export const ScanFreshman = ({
  value,
  onChangeValue,
  onValueDecoded,
  ...rest
}: ScanFreshmanProps): React.ReactElement => {
  const navigation = useNavigation();
  const { api } = useContext(ApiContext);

  const [isDecoding, setDecoding] = useState(false);

  const onDecodeError = (err: Error): T.Task<never> => {
    console.log("ERROR");
    setDecoding(false);
    return T.never;
    // TODO: popup error
  };

  const onDecodeSuccess = (res: BarcodeDecode): T.Task<undefined> => {
    console.log("SUCCESS!");
    setDecoding(false);
    onValueDecoded(res);
    return T.of(undefined);
  };

  useEffect(() => {
    if (value) {
      setDecoding(true);
      pipe(value, api.barcodeDecode, TE.fold(onDecodeError, onDecodeSuccess))();
    }
  }, [value]);

  const onIconPress = () =>
    navigation.navigate("Scan", {
      onBarcodeScanned: (barcodeEvent: BarcodeEvent) =>
        onChangeValue(barcodeEvent.data),
    });

  return (
    <Input
      value={value}
      onChangeText={onChangeValue}
      rightIcon={
        (!isDecoding && <Icon name="camera" onPress={onIconPress} />) || (
          <Spinner onTouchStart={onIconPress} />
        )
      }
      containerStyle={{ width: "100%" }}
      {...rest}
    />
  );
};

// <Icon name="camera" onPress={onIconPress ? onIconPress : noop} />
