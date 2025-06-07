import { StyleSheet, View } from "react-native";
import { Card, List, Avatar, Divider } from "react-native-paper";
import { User } from "../types/UserType";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Fix para iconos en web

interface Props {
  alumnos: User[];
}
const AlumnosList = ({ alumnos }: Props) => {
  return (
    <Card style={styles.card}>
      <List.Accordion
        title={`Alumnos (${alumnos.length})`}
        left={(props) => (
          <List.Icon
            {...props}
            icon={({ size, color }) => (
              <MaterialCommunityIcons
                name="account-group-outline"
                size={size}
                color={color}
              />
            )}
          />
        )}
        right={(props) => (
          <MaterialCommunityIcons
            name={props.isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#fff"
          />
        )}
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
      >
        {alumnos.length === 0 ? (
          <List.Item
            title="No hay alumnos"
            left={(props) => (
              <List.Icon
                {...props}
                icon={({ size, color }) => (
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={size}
                    color={color}
                  />
                )}
              />
            )}
            titleStyle={{ color: "#888" }}
          />
        ) : (
          alumnos.map((alumno, idx) => (
            <View key={alumno.id}>
              <List.Item
                title={alumno.nombre}
                description={alumno.email}
                left={() => (
                  <Avatar.Text
                    size={36}
                    label={alumno.nombre ? alumno.nombre[0].toUpperCase() : "A"}
                    style={styles.avatar}
                    color="#fff"
                  />
                )}
                titleStyle={styles.itemTitle}
                descriptionStyle={styles.itemDescription}
                style={styles.listItem}
              />
              {idx < alumnos.length - 1 && <Divider />}
            </View>
          ))
        )}
      </List.Accordion>
    </Card>
  );
};

export default AlumnosList;

const styles = StyleSheet.create({
  card: {
    width: "100%",

    maxWidth: 600,
    marginBottom: 12,
    elevation: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  accordion: {},
  accordionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  listItem: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  itemTitle: {
    color: "#C93A4A",
    fontWeight: "600",
    fontSize: 16,
  },
  itemDescription: {
    color: "#888",
    fontSize: 13,
  },
  avatar: {
    backgroundColor: "#C93A4A",
    marginRight: 8,
  },
});
