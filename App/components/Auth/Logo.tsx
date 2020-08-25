import React from "react";
import { Image, StyleSheet } from "react-native";

const Logo = () => (
  <Image source={require("../../../assets/logo.png")} style={styles.image} />
);

const LogoMemo = React.memo(Logo);

export { LogoMemo as Logo };

const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 128,
    marginBottom: 12,
  },
});
