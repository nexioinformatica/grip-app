import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export const Content = ({ children }: Props): React.ReactElement => (
  <View style={styles.content}>{children}</View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
});
