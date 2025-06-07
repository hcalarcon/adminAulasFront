import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#d83dff",
    background: "#d1a3ff",
    surface: "#d1a3ff",
    text: "#2b2b2b",
    secondary: "#4ab19f",
    accent: "#f2c94c",
    asistenciaBuena: "#10b981",
    asistenciaMedia: "#ffb93f",
    asistenciaMala: "#ef4444",
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#b14aca",
    background: "#302f2f",
    surface: "#1e1e1e",
    text: "#ffffff",
    secondary: "#4ab19f",
    accent: "#f2c94c",
    asistenciaBuena: "#097551",
    asistenciaMedia: "#f59e0b",
    asistenciaMala: "#e21313",
  },
};
