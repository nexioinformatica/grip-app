import React from "react";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

type Props = {
  children: React.ReactNode;
};

export const Container = ({ children }: Props) => (
  <Surface style={styles.container}>{children}</Surface>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
});
