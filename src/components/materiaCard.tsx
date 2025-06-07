import { Card, Text, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { MateriasSimpleType } from "../types/AulaType";
import { LinearGradient } from "expo-linear-gradient";
type Props = {
  materia: MateriasSimpleType;
  onPress?: (materia: MateriasSimpleType) => void;
  porcentaje?: number;
  is_alumno: boolean;
  alarcoin?: number;
};

export default function MateriasCard({
  materia,
  onPress,
  porcentaje = 0,
  is_alumno,
  alarcoin,
}: Props) {
  const { colors } = useTheme();
  const getColorFromPorcentaje = (porcentaje: number) => {
    if (porcentaje === 0) return ["transparent", "transparent"];
    if (porcentaje < 60) return [colors.background, colors.asistenciaMala]; // rojo
    if (porcentaje < 79) return [colors.background, colors.asistenciaMedia]; // naranja

    return [colors.background, colors.asistenciaBuena]; // verde
  };

  return (
    <Card
      style={[styles.card]}
      mode="outlined"
      onPress={onPress ? () => onPress(materia) : undefined}
    >
      <LinearGradient
        colors={
          is_alumno && !alarcoin
            ? getColorFromPorcentaje(porcentaje)
            : ["#trnasparent", "transparent"]
        }
        start={{ x: 0.4, y: 0.3 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 8, padding: 10 }}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.infoLeft}>
            <Text variant="titleMedium">{materia.nombre}</Text>
            <View style={styles.scheduleRow}>
              <Text variant="bodySmall">
                {`${materia.ano}° ${materia.division}° - ${materia.especialidad}`}
              </Text>
            </View>
          </View>
          <View style={styles.infoRight}>
            <Text variant="labelSmall">
              {is_alumno && alarcoin == null
                ? "Asistencias"
                : alarcoin != null
                ? "Alarcoins"
                : " Clases dictadas"}
            </Text>
            <Text variant="titleMedium" style={styles.classCount}>
              {is_alumno && alarcoin == null
                ? `${porcentaje}%`
                : alarcoin != null
                ? alarcoin
                : materia.cantidad_clases}
            </Text>
          </View>
        </Card.Content>
      </LinearGradient>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    width: "100%",
    marginHorizontal: 10,
    maxWidth: 450,
    borderRadius: 8,
    elevation: 3,
    alignSelf: "center",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoLeft: {
    flex: 1,
    gap: 4,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },

  infoRight: {
    alignItems: "flex-end",
  },

  classCount: {
    marginTop: 2,
    fontWeight: "600",
  },
});
