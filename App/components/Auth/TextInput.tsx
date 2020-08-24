import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input, IconButton } from "react-native-paper";
import { theme } from "../../util/theme";
import { Icon } from "../Icon";

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

export const TextInput = memo(({ errorText, ...props }: Props) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
));

export const TextInputIcon = Input.Icon;

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
