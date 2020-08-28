import React from "react";
import { StyleSheet, Text } from "react-native";

import { theme } from "../../util/theme";

type Props = {
  children: React.ReactNode;
};

const Header = ({ children }: Props) => (
  <Text style={styles.header}>{children}</Text>
);

const HeaderMemo = React.memo(Header);

export { HeaderMemo as Header };

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: theme.colors.primary,
    fontWeight: "bold",
    paddingVertical: 14,
  },
});
