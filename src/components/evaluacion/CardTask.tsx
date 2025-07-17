import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Badge, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { tipoTareaValorToTexto } from "../../utils/tipoTarea";

interface CardTaskProps {
  tipo: string; // Ej: "Examen"
  estado: string; // Ej: "Completada"
  titulo: string;
  descripcion: string;
  fechaVencimiento: string; // Ej: "14/7/2024"
  calificacionRecibida?: number; // Ej: "85/100"
  nombreAula?: string;
}

const tipoBadgeColors: Record<string, string> = {
  Evaluación: "#f55555ff",
  "Trabajo Práctico": "#93C5FD",
  "Trabajo Teórico": "#FCD34D",
  Actitudinal: "#C4B5FD",
};

const estadoBadgeColors: Record<string, string> = {
  Completada: "#029134ff",
  Pendiente: "#fda520ff",
};

const CardTask: React.FC<CardTaskProps> = ({
  tipo,
  estado,
  titulo,
  descripcion,
  fechaVencimiento,
  calificacionRecibida,
  nombreAula,
}) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.header}>
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color={theme.colors.onSurfaceVariant}
          />
          <View style={styles.badgesContainer}>
            <Badge
              style={[
                styles.badge,
                {
                  backgroundColor:
                    tipoBadgeColors[tipoTareaValorToTexto[tipo]] ?? "#E5E7EB",
                },
              ]}
              size={24}
            >
              {tipoTareaValorToTexto[tipo]}
            </Badge>
            <Badge
              style={[
                styles.badge,
                { backgroundColor: estadoBadgeColors[estado] ?? "#E5E7EB" },
              ]}
              size={24}
            >
              {estado}
            </Badge>
          </View>
        </View>
      </Card.Content>

      <Card.Content>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 0.8 }}>
            <Text variant="titleMedium" style={styles.title}>
              {titulo}
            </Text>

            <View style={styles.aulaContainer}>
              <Ionicons
                name="school-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={{ marginLeft: 4 }}>
                {nombreAula}
              </Text>
            </View>
            <Text
              variant="bodyMedium"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {descripcion}
            </Text>

            <View style={styles.fechaContainer}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={{ marginLeft: 4 }}>
                Vence: {fechaVencimiento}
              </Text>
            </View>
          </View>
          {calificacionRecibida && (
            <View
              style={{
                flex: 0.2,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Text variant="titleSmall">Nota:</Text>
              <Text
                variant="headlineSmall"
                style={{
                  fontWeight: "700",
                  color: calificacionRecibida > 6 ? "green" : "red",
                }}
              >
                {calificacionRecibida}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export default CardTask;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: 400,
    marginVertical: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    color: "#000",
    marginLeft: 8,
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontWeight: "700",
  },
  title: {
    marginTop: 8,
    fontWeight: "700",
  },
  aulaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  fechaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  calificacionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
