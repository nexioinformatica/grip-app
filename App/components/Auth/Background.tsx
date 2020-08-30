import React from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { useTheme, Surface } from "react-native-paper";

type Props = {
  containerStyle?: Record<string, unknown>;
  children: React.ReactNode;
};

const DottedBackground = ({
  children,
  theme,
}: {
  children: React.ReactElement;
  theme: ReactNativePaper.Theme;
}) => (
  <ImageBackground
    source={require("../../../assets/background_dot.png")}
    resizeMode="repeat"
    style={{ ...styles.background, backgroundColor: theme.colors.surface }}
  >
    {children}
  </ImageBackground>
);

const FlatBackground = ({ children }: { children: React.ReactElement }) => (
  <Surface style={styles.background}>{children}</Surface>
);

const BackgroundWrapper = ({
  children,
  theme,
}: {
  children: React.ReactElement;
  theme: ReactNativePaper.Theme;
}) =>
  theme.dark ? (
    <FlatBackground>{children}</FlatBackground>
  ) : (
    <DottedBackground theme={theme}>{children}</DottedBackground>
  );

const Background = ({ containerStyle, children }: Props) => {
  const theme = useTheme();

  return (
    <BackgroundWrapper theme={theme}>
      <KeyboardAvoidingView
        style={{ ...styles.container, ...containerStyle }}
        behavior="padding"
      >
        {children}
      </KeyboardAvoidingView>
    </BackgroundWrapper>
  );
};

const BackgroundMemo = React.memo(Background);

export { BackgroundMemo as Background };

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
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
