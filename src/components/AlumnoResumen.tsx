import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Avatar,
  Text,
  Card,
  ProgressBar,
  Button,
  useTheme,
} from "react-native-paper";
import { getInitials } from "../utils/initials";

interface StudentCardProps {
  name: string;
  email: string;
  promedio: number;
  asistencia: number;
  completadas: number;
  totalTareas: number;
  estado?: "Excelente" | "Bien" | "Regular";
  onPressDetalles?: () => void;
}

const AlumnoResumen: React.FC<StudentCardProps> = ({
  name,
  email,
  promedio,
  asistencia,
  completadas,
  totalTareas,
  estado = "Bien",
  onPressDetalles,
}) => {
  const theme = useTheme();
  const initials = getInitials(name);

  const badgeColors = {
    Excelente: theme.colors.tertiary,
    Bien: theme.colors.secondary,
    Regular: theme.colors.error,
  };

  const badgeColor = badgeColors[estado];

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Title
        title={name}
        subtitle={email}
        titleVariant="titleMedium"
        subtitleVariant="bodySmall"
        left={() => <Avatar.Text size={40} label={initials} />}
        right={() => (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{estado}</Text>
          </View>
        )}
      />

      <Card.Content>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text variant="labelSmall" style={styles.label}>
              Promedio
            </Text>
            <Text variant="titleMedium">{promedio}%</Text>
          </View>
          <View style={styles.column}>
            <Text variant="labelSmall" style={styles.label}>
              Asistencia
            </Text>
            <Text variant="titleMedium">{asistencia}%</Text>
          </View>
        </View>

        <View style={styles.progressWrapper}>
          <View style={styles.progressLabel}>
            <Text variant="labelSmall" style={styles.label}>
              Tareas Completadas
            </Text>
            <Text variant="bodyMedium">{`${completadas}/${totalTareas}`}</Text>
          </View>
          <ProgressBar
            progress={completadas / totalTareas}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>
      </Card.Content>

      <Card.Actions>
        <Button onPress={onPressDetalles} mode="contained-tonal">
          Ver detalles
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 16,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 16,
    alignSelf: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  column: {
    flex: 1,
  },
  label: {
    color: "gray",
    marginBottom: 4,
  },
  progressWrapper: {
    marginTop: 8,
  },
  progressLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
  },
});

export default AlumnoResumen;
