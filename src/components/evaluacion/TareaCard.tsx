import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Text,
  Button,
  useTheme,
  ProgressBar,
  Badge,
  IconButton,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  titulo: string;
  tipo: string;
  entregados: number;
  descripcion: string;
  fechaEntrega: string;
  cantidadAlumnos: number;
  nombreAula: string | undefined;
  onEditar?: () => void;
  onEliminar?: () => void;
  onCalificar?: () => void;
}

const TareaCard = ({
  titulo,
  tipo,
  entregados,
  descripcion,
  fechaEntrega,
  cantidadAlumnos,
  nombreAula,
  onEditar,
  onEliminar,
  onCalificar,
}: Props) => {
  const theme = useTheme();
  const progreso = cantidadAlumnos > 0 ? entregados / cantidadAlumnos : 0;

  const tipoLabel: Record<string, string> = {
    tp: "Trabajo Práctico",
    tt: "Trabajo Teórico",
    evaluacion: "Evaluación",
    actitudinal: "Actitudinal",
  };

  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Content
        style={{
          paddingBottom: 4,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {/* Título y tipo */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text variant="titleMedium" style={styles.title}>
                {titulo}
              </Text>
              <Ionicons
                name="time-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.badgesRow}>
              <Badge style={styles.badgeTipo}>{tipoLabel[tipo]}</Badge>
              <Badge
                style={styles.badgeEntregas}
              >{`${entregados}/${cantidadAlumnos} entregadas`}</Badge>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <Text variant="bodySmall" style={styles.descripcion}>
          {descripcion}
        </Text>

        {/* Progreso */}

        <View style={styles.infoItem}>
          <Ionicons
            name="book-outline"
            size={14}
            color={theme.colors.outline}
          />
          <Text style={styles.infoText}>{nombreAula}</Text>
        </View>
        <View style={styles.progreso}>
          <View style={styles.progresoRow}>
            <Text style={styles.label}>Progreso de entrega</Text>
            <Text style={styles.label}>{Math.round(progreso * 100)}%</Text>
          </View>
          <ProgressBar
            progress={progreso}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>

        {/* Info extra */}
        <View style={styles.extraInfo}>
          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={theme.colors.outline}
            />
            <Text style={styles.infoText}>Vence: {fechaEntrega}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name="people-outline"
              size={14}
              color={theme.colors.outline}
            />
            <Text style={styles.infoText}>{cantidadAlumnos} Estudiantes</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonRow}>
          <IconButton
            mode="contained-tonal"
            containerColor="#eca469"
            iconColor="#2563EB"
            style={{ marginHorizontal: 2, borderRadius: 8 }}
            onPress={onEditar}
            icon={({ size, color }) => (
              <Ionicons name="pencil-outline" size={size} color={color} />
            )}
            accessibilityLabel="Editar tarea"
          />

          <IconButton
            mode="contained-tonal"
            containerColor="#FEE2E2"
            iconColor="#B91C1C"
            style={{ marginHorizontal: 2, borderRadius: 8 }}
            onPress={onEliminar}
            icon={({ size, color }) => (
              <Ionicons name="trash-outline" size={size} color={color} />
            )}
            accessibilityLabel="Eliminar tarea"
          />

          <Button
            mode="contained"
            style={{
              borderRadius: 8,
              marginLeft: 8,
              height: 40, // igual al IconButton
              justifyContent: "center",
              paddingVertical: 0,
            }}
            contentStyle={{
              flexDirection: "row-reverse",
              paddingVertical: 0,
              height: 40,
            }}
            labelStyle={{ fontSize: 14 }}
            onPress={onCalificar}
            icon={({ size, color }) => (
              <Ionicons name="create-outline" size={size} color={color} />
            )}
            accessibilityLabel="Calificar tarea"
          >
            Calificar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default TareaCard;

const styles = StyleSheet.create({
  card: {
    maxWidth: 360,
    borderRadius: 12,
    marginBottom: 16,
    padding: 2,
  },
  header: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  title: {
    fontWeight: "bold",
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badgeTipo: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
  },
  badgeEntregas: {
    backgroundColor: "#E0E7FF",
    color: "#3730A3",
  },
  descripcion: {
    marginBottom: 12,
  },
  progreso: {
    marginBottom: 12,
  },
  progresoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    borderRadius: 4,
  },
  extraInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  label: {
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    alignItems: "center",
  },
});
