import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryColor } from "../../utils/colors";

type Props = {
  title: string;
  value: string | number;
  icon: string;
  bgColor?: string;
  iconColor?: string;
};

export default function ResumenMiniCard({
  title,
  value,
  icon,
  bgColor = "#F5F5F5",
}: Props) {
  return (
    <Card style={[styles.card]}>
      <Card.Content>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardValue}>{value}</Text>
          </View>
          <Ionicons name={icon} size={32} color={PrimaryColor} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    marginBottom: 16,
    paddingVertical: 4,
    paddingHorizontal: 2,
    minWidth: 150,
    maxWidth: 160,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
});
