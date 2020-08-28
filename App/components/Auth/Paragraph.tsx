import React from "react";
import { StyleSheet, Text } from "react-native";

import { theme } from "../../util/theme";

type Props = {
  children: React.ReactNode;
};

const Paragraph = ({ children }: Props) => (
  <Text style={styles.text}>{children}</Text>
);

const ParagraphMemo = React.memo(Paragraph);

export { ParagraphMemo as Paragraph };

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.secondary,
    textAlign: "center",
    marginBottom: 14,
  },
});
