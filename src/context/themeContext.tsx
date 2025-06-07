import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import { lightTheme, darkTheme } from "../utils/theme";
import { useColorScheme } from "react-native";
import { getFromStorage, saveToStorage } from "../utils/storage";

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme(); // 'light' | 'dark' | null
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await getFromStorage("theme");
      if (stored === "light" || stored === "dark") {
        setUseSystemTheme(false);
        setIsDarkMode(stored === "dark");
      } else {
        setUseSystemTheme(true);
        setIsDarkMode(systemColorScheme === "dark");
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (useSystemTheme && systemColorScheme) {
      setIsDarkMode(systemColorScheme === "dark");
    }
  }, [systemColorScheme, useSystemTheme]);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === "dark");
    });
    return () => listener.remove();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    setUseSystemTheme(false);
    await saveToStorage("theme", newValue ? "dark" : "light");
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
