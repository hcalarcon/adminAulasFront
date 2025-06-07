// src/screens/SplashScreen.tsx
import React, { useEffect } from "react";
import { StyleSheet, Animated } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { PrimaryColor } from "../utils/colors";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const { colors } = useTheme();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 1000);
    });
  }, []);

  return (
    <Animated.View
      style={[styles.container, { opacity }, { backgroundColor: PrimaryColor }]}
    >
      <Text variant="titleLarge" style={styles.title}>
        AdminAulas 🚀
      </Text>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
