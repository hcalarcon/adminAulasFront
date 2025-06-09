import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  RadioButton,
  TextInput,
  ActivityIndicator,
  Portal,
  Modal,
  useTheme,
  Card,
} from "react-native-paper";
import { ClaseType } from "../types/AulaType";
import { useAppData } from "../context/appDataContext";
import { AsistenciasClase } from "../api/asistenciasClases";
import { useAuth } from "../context/authContent";
import { AsistenciaType } from "../types/AsistenciaType";
import { setClaseAsistencia } from "../api/setClaseAsistencia";

type Props = {
  visible: boolean;
  onClose: () => void;
  clase: ClaseType;
};

type AsistenciaEdit = {
  alumno_id: number;
  presente: number;
  justificado?: string;
};

export default function ModalAsistencia({ visible, onClose, clase }: Props) {
  const { token } = useAuth();
  const { alumnosMap, aulas } = useAppData();
  const [asistencias, setAsistencias] = useState<AsistenciaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [asistenciasEditadas, setAsistenciasEditadas] = useState<
    AsistenciaEdit[]
  >([]);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const isMobile = width < 600;
  const columns = width >= 1000 ? 3 : width >= 700 ? 2 : 1;

  const aula = aulas.find((a) => a.id === clase.aula_id);
  const alumnos =
    aula?.alumnoIds.map((id) => alumnosMap[id]).filter(Boolean) ?? [];

  useEffect(() => {
    if (!visible) return;

    setIsLoading(true);
    const getAsistencias = async () => {
      try {
        const data = await AsistenciasClase(clase.id, token);
        setAsistencias(data);
        if (data.length === 0) {
          const todosPresentes: AsistenciaEdit[] = alumnos.map((alumno) => ({
            alumno_id: alumno.id,
            presente: 1,
          }));
          setAsistenciasEditadas(todosPresentes);
        }
      } catch (error) {
        console.error("Error al obtener asistencias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getAsistencias();
    setAsistenciasEditadas([]);
  }, [visible, clase.id]);

  useEffect(() => {
    if (!visible) {
      setAsistencias([]);
      setAsistenciasEditadas([]);
    }
  }, [visible]);

  const handleChange = (alumno_id: number, presente: number) => {
    setAsistenciasEditadas((prev) => {
      const existente = prev.find((a) => a.alumno_id === alumno_id);
      if (existente) {
        return prev.map((a) =>
          a.alumno_id === alumno_id ? { ...a, presente } : a
        );
      } else {
        return [...prev, { alumno_id, presente }];
      }
    });
  };

  const handleJustificacionChange = (
    alumno_id: number,
    justificado: string
  ) => {
    setAsistenciasEditadas((prev) => {
      const existente = prev.find((a) => a.alumno_id === alumno_id);
      if (existente) {
        return prev.map((a) =>
          a.alumno_id === alumno_id ? { ...a, justificado } : a
        );
      } else {
        return [...prev, { alumno_id, presente: 2, justificado }];
      }
    });
  };

  const handleGuardar = async () => {
    try {
      if (asistenciasEditadas.length === 0) {
        Alert.alert("Sin cambios", "No se detectaron asistencias editadas.");
        return;
      }

      const payload = alumnos.map((alumno) => {
        const editada = asistenciasEditadas.find(
          (a) => a.alumno_id === alumno.id
        );

        return {
          alumno_id: alumno.id,
          presente: editada?.presente ?? 1,
          justificado: editada?.justificado ?? "no",
        };
      });

      console.log("Payload a enviar:", payload);
      await setClaseAsistencia(clase.id, token, payload);

      Alert.alert(
        "Guardado",
        "Las asistencias fueron actualizadas correctamente."
      );
      setAsistenciasEditadas([]);
      onClose();
    } catch (error: any) {
      console.error("Error al guardar asistencias:", error);
      Alert.alert("Error", error.message || "Ocurrió un error al guardar.");
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text variant="titleMedium" style={styles.headerTitle}>
          Asistencia - {clase.tema}
        </Text>

        {isLoading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={[styles.grid, { gap: 12 }]}>
              {alumnos.map((alumno) => {
                const asistenciaExistente = asistencias.find(
                  (a) => a.alumno_id === alumno.id
                );
                const asistenciaEditada = asistenciasEditadas.find(
                  (a) => a.alumno_id === alumno.id
                );
                const valuePresente =
                  asistenciaEditada?.presente?.toString() ??
                  asistenciaExistente?.presente?.toString() ??
                  "";

                const valueJustificado =
                  asistenciaEditada?.justificado ??
                  asistenciaExistente?.justificado ??
                  "";

                return (
                  <View
                    key={alumno.id}
                    style={[
                      styles.cardWrapper,
                      { width: `${100 / columns - 4}%` },
                    ]}
                  >
                    <Card mode="outlined" style={styles.alumnoCard}>
                      <Card.Content style={{ gap: 4, padding: 5 }}>
                        <Text style={styles.nombreAlumno}>
                          {alumno.nombre} {alumno.apellido}
                        </Text>

                        <RadioButton.Group
                          onValueChange={(value) =>
                            handleChange(alumno.id, parseInt(value))
                          }
                          value={valuePresente}
                        >
                          <View style={styles.radioRowFixed}>
                            {[
                              {
                                label: isMobile ? "P" : "Presente",
                                value: "1",
                              },
                              { label: isMobile ? "A" : "Ausente", value: "2" },
                              { label: isMobile ? "T" : "Tarde", value: "3" },
                              {
                                label: "NC",
                                value: "0",
                              },
                            ].map((item) => (
                              <Pressable
                                key={item.value}
                                style={styles.radioItemPressable}
                                onPress={() =>
                                  handleChange(alumno.id, parseInt(item.value))
                                }
                              >
                                <RadioButton
                                  value={item.value}
                                  status={
                                    valuePresente === item.value
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() =>
                                    handleChange(
                                      alumno.id,
                                      parseInt(item.value)
                                    )
                                  }
                                />
                                <Text
                                  style={[
                                    isMobile
                                      ? styles.radioLabelMobile
                                      : styles.radioLabel,
                                    styles.radioLabelText,
                                  ]}
                                >
                                  {item.label}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        </RadioButton.Group>

                        <TextInput
                          label="Justificación"
                          mode="outlined"
                          value={valueJustificado}
                          onChangeText={(text) =>
                            handleJustificacionChange(alumno.id, text)
                          }
                        />
                      </Card.Content>
                    </Card>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}

        <View style={styles.buttonRow}>
          <Button mode="text" onPress={onClose}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleGuardar}>
            Guardar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 10,
    padding: 20,
    borderRadius: 12,
    maxHeight: "95%",
  },
  scroll: {
    paddingVertical: 5,
  },
  headerTitle: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    marginBottom: 16,
  },
  alumnoCard: {
    borderRadius: 12,
  },
  nombreAlumno: {
    fontWeight: "600",
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
  radioRowFixed: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "nowrap", // importante para evitar múltiples filas
  },

  radioItemFixed: {
    flex: 1,
    margin: 0,
    padding: 0,
  },

  radioLabel: {
    fontSize: 14,
  },

  radioLabelMobile: {
    fontSize: 12,
  },
  radioItemPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: 50,
    maxWidth: 80,
  },

  radioLabelText: {
    textAlign: "center",
    flexShrink: 1,
  },
});
