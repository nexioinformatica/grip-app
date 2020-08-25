import { DefaultTheme, DarkTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    secondary: "#414757",
    error: "#f13a59",
  },
};

export const lightTheme = {
  ...DefaultTheme,
};

export const darkTheme = {
  ...DarkTheme,
};
