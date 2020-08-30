import React from "react";
import { StyleSheet } from "react-native";
import {
  TextInput as Input,
  Text,
  useTheme,
  Surface,
} from "react-native-paper";
import { FlatSurface } from "../Surface";

type Props = React.ComponentProps<typeof Input> & { errorText?: string };
export type TextInputProps = Props;

const TextInput = ({ errorText, ...props }: Props) => {
  const theme = useTheme();
  return (
    <FlatSurface style={{ ...styles.container }}>
      <Input
        selectionColor="#fff"
        underlineColor="transparent"
        mode="outlined"
        theme={{ colors: { background: theme.colors.surface } }}
        {...props}
      />
      {errorText ? (
        <Text style={{ ...styles.error, color: theme.colors.error }}>
          {errorText}
        </Text>
      ) : null}
    </FlatSurface>
  );
};

const TextInputMemo = React.memo(TextInput);

const TextInputIcon = Input.Icon;

export { TextInputMemo as TextInput, TextInputIcon };

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});
