import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { ClaseType } from "../types/AulaType";
import ModalAsistencia from "./ModalAsistencias";
import { useAuth } from "../context/authContent";
import { AsistenciaType } from "../types/AsistenciaType";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  clase: ClaseType;
  asistencia: AsistenciaType | undefined;
};

export default function ClaseCard({ clase, asistencia }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const { colors } = useTheme();
  const getColorFromAsistencia = (asistencia: number) => {
    if (asistencia === 1) return [colors.background, colors.asistenciaBuena];
    if (asistencia === 2) return [colors.background, colors.asistenciaMala]; //rojo
    if (asistencia === 3) return [colors.background, colors.asistenciaMedia]; // naranja
    return ["transparent", "transparent"];
  };

  return (
    <>
      <Card style={[styles.card]}>
        <LinearGradient
          colors={
            !user?.is_teacher
              ? getColorFromAsistencia(asistencia?.presente)
              : ["#trnasparent", "transparent"]
          }
          start={{ x: 0.4, y: 0.3 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 8, padding: 10 }}
        >
          <Card.Content>
            <View style={styles.headerRow}>
              <Text variant="titleSmall" style={styles.cardTitle}>
                {clase.tema}
              </Text>

              <View style={styles.iconButtons}>
                {user?.is_teacher ? (
                  <>
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color="#9CA3AF"
                      style={styles.iconMargin}
                    />
                    <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
                  </>
                ) : (
                  <Text variant="bodyMedium">
                    {" "}
                    {asistencia
                      ? asistencia.presente === 1
                        ? "Presente"
                        : asistencia.presente === 2
                        ? "Ausente"
                        : "Tarde"
                      : "Sin asistencia"}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.scheduleRow}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color="#9CA3AF"
                style={styles.iconMargin}
              />
              <Text variant="bodySmall" style={styles.cardSubtitle}>
                {clase.fecha.toString()}
              </Text>
            </View>

            {user?.is_teacher && (
              <Button
                mode="outlined"
                icon={({ color, size }) => (
                  <Ionicons name="checkmark-circle" color={color} size={size} />
                )}
                style={styles.attendanceButton}
                onPress={() => setModalVisible(true)}
              >
                Tomar asistencia
              </Button>
            )}
          </Card.Content>
        </LinearGradient>
      </Card>

      {/* Modal de asistencia */}
      <ModalAsistencia
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        clase={clase}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 8,
    elevation: 2,
    alignSelf: "center",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButtons: {
    flexDirection: "row",
  },
  iconMargin: {
    marginRight: 8,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#6B7280",
  },
  attendanceButton: {
    marginTop: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  modalCloseButton: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
  modalCloseText: {
    color: "#2563EB",
    fontWeight: "bold",
  },
});
