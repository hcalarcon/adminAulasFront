import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableRipple, useTheme, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  label: string;
  status: "checked" | "unchecked";
  onPress: () => void;
}

const CheckboxItem = ({ label, status, onPress }: Props) => {
  const { colors } = useTheme();
  return (
    <TouchableRipple onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <Ionicons
          name={status === "checked" ? "checkbox-outline" : "square-outline"}
          size={24}
          color={status === "checked" ? colors.primary : colors.secondary}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 16,
  },
});

export default CheckboxItem;
