import React from "react";
import { TextInput, TextInputIcon } from "./TextInput";
import { TouchableOpacity, View } from "react-native";
import { noop } from "../../util/noop";

export type Props = React.ComponentProps<typeof TextInput> & {
  retry?: () => void;
};

export const TextInputFail = ({
  retry,
  ...rest
}: Props): React.ReactElement => {
  const handleRetry = retry ? retry : noop;

  return (
    <TouchableOpacity onPress={handleRetry}>
      <View pointerEvents="none">
        <TextInput
          editable={false}
          {...rest}
          right={<TextInputIcon name="reload" />}
          error={true}
          errorText="Caricamento dei dati fallito"
        />
      </View>
    </TouchableOpacity>
  );
};
