import { Card, Avatar, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
type Props = {
  title: string;
  value: number;
  icon: string;
  color: string;
};

const ResumenMiniCard = ({ title, value, icon, color = "#6200ee" }: Props) => {
  return (
    <Card style={styles.card} mode="contained">
      <Card.Content style={styles.cardContent}>
        <Avatar.Icon
          icon={({ color, size }) => (
            <Ionicons name={icon} color={color} size={size} />
          )}
          style={{ backgroundColor: color }}
        />
        <View style={{ marginLeft: 12 }}>
          <Text variant="labelLarge" style={{ color: "#777" }}>
            {title}
          </Text>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            {value}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default ResumenMiniCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 600,
    minWidth: 350,
    marginBottom: 12,
    elevation: 12,
    borderRadius: 12,
    alignSelf: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
