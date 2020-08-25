import React from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

type Props = {
  containerStyle?: Record<string, unknown>;
  children: React.ReactNode;
};

const Background = ({ containerStyle, children }: Props) => (
  <ImageBackground
    source={require("../../../assets/background_dot.png")}
    resizeMode="repeat"
    style={styles.background}
  >
    <KeyboardAvoidingView
      style={{ ...styles.container, ...containerStyle }}
      behavior="padding"
    >
      {children}
    </KeyboardAvoidingView>
  </ImageBackground>
);

const BackgroundMemo = React.memo(Background);

export { BackgroundMemo as Background };

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
  },
});
