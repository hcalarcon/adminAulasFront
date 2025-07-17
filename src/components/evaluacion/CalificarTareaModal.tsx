import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  useTheme,
  RadioButton,
} from "react-native-paper";
import { NotaTareaUpdateMasiva, NotaType } from "../../types/NotaType";
import { TareaBase } from "../../types/TareaType";
import { getNotas } from "../../api/notas";
import { useAppData } from "../../context/appDataContext";
import { UserConNota } from "../../types/UserType";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onGuardar: (nota: NotaTareaUpdateMasiva) => void;
  tarea: TareaBase;
}

const CalificarTareaModal = ({
  visible,
  onDismiss,
  tarea,
  onGuardar,
}: Props) => {
  const { colors } = useTheme();
  const { alumnosMap } = useAppData();
  const [alumnos, setAlumnos] = useState<UserConNota[]>([]);

  const botonDeshabilitado = alumnos.some(
    (alumno) => alumno.nota.trim() === ""
  );
  useEffect(() => {
    const fetchNotas = async () => {
      if (!tarea?.id) return;

      try {
        const notas = await getNotas(tarea.id);
        // Mapear para estructurar como se necesita en el frontend
        const alumnosConNotas = notas.map((nota: NotaType) => ({
          id: nota.alumno_id,
          nombre: alumnosMap[nota.alumno_id]?.nombre ?? "Alumno",
          apellido: alumnosMap[nota.alumno_id].apellido,
          nota: nota.nota ?? "",
          entregado: nota.entregado ?? false,
          nota_id: nota.id,
        }));
        setAlumnos(alumnosConNotas);
      } catch (error) {
        console.error("Error al cargar notas", error);
      }
    };

    fetchNotas();
  }, [tarea]);

  const cerrarModal = () => {
    setAlumnos([]);
    onDismiss();
  };

  const handleGuardar = async () => {
    const notasActualizada: NotaTareaUpdateMasiva = {
      tarea_id: tarea.id as number,
      notas: alumnos.map((alumno) => ({
        alumno_id: alumno.id,
        nota: alumno.nota, // ya es string (por ejemplo, "9.50")
        entregado: alumno.entregado,
      })),
    };
    onGuardar(notasActualizada);
    cerrarModal();
  };

  const handleNotaChange = (id: number, nuevaNota: string) => {
    setAlumnos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, nota: nuevaNota } : a))
    );
  };

  const toggleEntregado = (id: number) => {
    setAlumnos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, entregado: !a.entregado } : a))
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            width: "90%",
            maxWidth: 500,
            height: "90%",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={90}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  padding: 16,
                  flexGrow: 1,
                }}
                showsVerticalScrollIndicator={false}
              >
                <Text variant="titleLarge" style={{ marginBottom: 8 }}>
                  Calificar Tarea
                </Text>
                <Text variant="titleMedium">{tarea.titulo}</Text>
                <Text style={{ marginBottom: 16 }}>{tarea.descripcion}</Text>

                <View style={{ marginTop: 16 }}>
                  {/* Encabezado */}
                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 5,
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ flex: 1, fontWeight: "bold" }}>Alumno</Text>
                    <Text
                      style={{
                        width: 100,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Entregado
                    </Text>
                    <Text
                      style={{
                        width: 80,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Nota
                    </Text>
                  </View>

                  {alumnos.map((alumno) => (
                    <View
                      key={alumno.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 6,
                        paddingHorizontal: 5,
                        borderBottomWidth: 0.5,
                        borderColor: "#ddd",
                      }}
                    >
                      {/* Nombre */}
                      <Text
                        style={{ flex: 1 }}
                      >{`${alumno.nombre} ${alumno.apellido}`}</Text>

                      <View
                        style={{
                          borderColor: colors.primary,
                          borderWidth: Platform.OS != "web" ? 1 : 0,
                          borderRadius: "50%",
                          marginRight: 40,
                        }}
                      >
                        <RadioButton
                          value={alumno.id.toString()}
                          status={alumno.entregado ? "checked" : "unchecked"}
                          onPress={() => toggleEntregado(alumno.id)}
                        />
                      </View>

                      {/* Nota */}
                      <TextInput
                        value={alumno.nota.toString()}
                        onChangeText={(text) =>
                          handleNotaChange(alumno.id, text)
                        }
                        mode="outlined"
                        keyboardType="numeric"
                        style={{
                          width: 70,
                          height: 40,

                          textAlign: "center",
                        }}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 16,
              gap: 8,
              padding: 10,
            }}
          >
            <Button onPress={onDismiss}>Cancelar</Button>
            <Button
              mode="contained"
              onPress={handleGuardar}
              disabled={botonDeshabilitado}
            >
              Guardar
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default CalificarTareaModal;
