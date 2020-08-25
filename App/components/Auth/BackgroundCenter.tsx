import React, { memo } from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Background } from "./Background";

type Props = {
  children: React.ReactNode;
};

export const BackgroundCenter = ({ children }: Props) => (
  <Background containerStyle={{ justifyContent: "center" }}>
    {children}
  </Background>
);
