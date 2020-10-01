import React from "react";
import { TouchableOpacity, View } from "react-native";

import { noop } from "../../util/noop";
import { TextInput, TextInputIcon } from "./TextInput";

type Props = React.ComponentProps<typeof TextInput> & {
  retry?: () => void;
};

export const TextInputFail = ({
  retry,
  errorText = "Caricamento dei dati fallito",
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
          errorText={errorText}
        />
      </View>
    </TouchableOpacity>
  );
};
