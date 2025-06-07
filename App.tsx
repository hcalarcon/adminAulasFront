// import Router from "./src/navigations/router";
// import { PaperProvider } from "react-native-paper";
// import { ThemeProvider, useThemeContext } from "./src/context/themeContext";
// import { StatusBar } from "expo-status-bar";
// import { useFonts } from "expo-font";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useCallback } from "react";

// export default function App() {
//   const [fontsLoaded] = useFonts({
//     ...MaterialCommunityIcons.font,
//   });

//   const onLayoutRootView = useCallback(async () => {
//     if (fontsLoaded) {

//     }
//   }, [fontsLoaded]);

//   if (!fontsLoaded) return null;
//   return (
//     <ThemeProvider>
//       <AppWithTheme />
//     </ThemeProvider>
//   );
// }

// function AppWithTheme() {
//   const { theme, isDarkMode } = useThemeContext();
//   return (
//     <PaperProvider theme={theme}>
//       <StatusBar style={isDarkMode ? "light" : "dark"} />
//       <Router />
//     </PaperProvider>
//   );
// }
import Router from "./src/navigations/router";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useThemeContext } from "./src/context/themeContext";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import Splash from "./src/screens/splashScreen"; // 👈

SplashScreen.preventAutoHideAsync(); // 👈

export default function App() {
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  const [showSplash, setShowSplash] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // podés validar token acá si querés
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) onLayoutRootView();
  }, [fontsLoaded]);

  const handleSplashFinish = async () => {
    setShowSplash(false);
    await SplashScreen.hideAsync(); // 👈 Oculta el splash nativo
  };

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      {showSplash ? <Splash onFinish={handleSplashFinish} /> : <AppWithTheme />}
    </ThemeProvider>
  );
}

function AppWithTheme() {
  const { theme, isDarkMode } = useThemeContext();
  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Router />
    </PaperProvider>
  );
}
