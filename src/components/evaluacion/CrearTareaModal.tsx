import { useEffect, useState, useMemo } from "react";
import {
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
import {
  Portal,
  Button,
  Text,
  TextInput,
  Menu,
  Modal,
  useTheme,
  TouchableRipple,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateInput from "../generales/DateInput";
import CheckboxItem from "../generales/Checkboxtem";
import { useAppData } from "../../context/appDataContext";
import { tareaNueva } from "../../types/TareaType";
import { useAuth } from "../../context/authContent";
import {
  DateFormatIsoLat,
  DateFormatLatIso,
  formatearFecha,
} from "../../utils/DateFormat";
import {
  tipoTareaTextoToValor,
  tipoTareaValorToTexto,
} from "../../utils/tipoTarea";
import { getNotas } from "../../api/notas";
import { NotaType } from "../../types/NotaType";

const tipos = [
  "Evaluación",
  "Trabajo Práctico",
  "Trabajo Teórico",
  "Actitudinal",
];

interface props {
  visible: boolean;
  onDismiss: () => void;
  onGuardar: (tarea: tareaNueva) => Promise<void>;
  tareaInicial?: tareaNueva | null;
}

const CrearTareaModal = ({
  visible,
  onDismiss,
  onGuardar,
  tareaInicial,
}: props) => {
  const { aulas, alumnosMap } = useAppData();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [materiaId, setMateriaId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [tipo, setTipo] = useState<string | null>(null);
  const [menuTipoVisible, setMenuTipoVisible] = useState(false);

  const [fechaLimite, setFechaLimite] = useState<string>();

  const [asignarTodos, setAsignarTodos] = useState(true);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState<number[]>(
    []
  );
  const [showAlumnos, setShowAlumnos] = useState(false);

  const alumnosDeMateria = useMemo(() => {
    const aula = aulas.find((a) => a.id === materiaId);
    if (!aula) return [];
    return aula.alumnoIds.map((id) => alumnosMap[id]).filter(Boolean);
  }, [materiaId, aulas, alumnosMap]);

  const toggleAlumno = (id: number) => {
    if (alumnosSeleccionados.includes(id)) {
      setAlumnosSeleccionados(alumnosSeleccionados.filter((x) => x !== id));
    } else {
      setAlumnosSeleccionados([...alumnosSeleccionados, id]);
    }
  };
  const reset = () => {
    setTitulo("");
    setDescripcion("");
    setTipo(null);
    setMateriaId(null);
    setFechaLimite(undefined);
    setAsignarTodos(true);
    setAlumnosSeleccionados([]);
  };

  const cerrar = () => {
    reset();
    onDismiss();
  };

  useEffect(() => {
    const cargarDatos = async () => {
      if (tareaInicial) {
        setTitulo(tareaInicial.titulo);
        setDescripcion(tareaInicial.descripcion as string);
        setTipo(
          tareaInicial.tipo != null
            ? tipoTareaValorToTexto[tareaInicial.tipo]
            : null
        );
        setMateriaId(tareaInicial.aula_id);
        setFechaLimite(
          DateFormatIsoLat(tareaInicial.fecha_limite as string) as string
        );
        try {
          const notas = await getNotas(tareaInicial.id as number);

          const idsAlumnos = notas.map((nota: NotaType) => nota.alumno_id);
          setAlumnosSeleccionados(idsAlumnos);

          const aula = aulas.find((a) => a.id === tareaInicial.aula_id);
          if (aula) {
            const todosIds = aula.alumnoIds ?? [];
            // Marcar asignarTodos solo si todos los alumnos están seleccionados
            setAsignarTodos(
              idsAlumnos.length > 0 &&
                todosIds.length === idsAlumnos.length &&
                todosIds.every((id) => idsAlumnos.includes(id))
            );
          } else {
            setAsignarTodos(false);
          }
        } catch (error) {
          console.error("Error cargando notas de tarea", error);
        }
      } else {
        reset();
      }
    };

    if (visible) {
      cargarDatos();
    }
  }, [visible, tareaInicial]);

  const handleGuardar = () => {
    if (materiaId === null) return; // Prevent calling with invalid aula_id
    if (!user?.id) return; // Prevent calling with undefined created_by

    const tarea = {
      titulo,
      descripcion,
      tipo: tipoTareaTextoToValor[tipo as string],
      fecha_limite: DateFormatLatIso(fechaLimite ?? ""),
      fecha_creacion: formatearFecha(new Date()),
      aula_id: materiaId,
      created_by: user.id,
      asignados: alumnosSeleccionados,
    };
    if (tareaInicial?.id) {
      // Modo edición
      onGuardar({ ...tarea, id: tareaInicial.id });
    } else {
      // Modo creación
      onGuardar(tarea);
    }

    onDismiss();
    reset();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={cerrar}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          padding: 16,
          margin: 10,
          borderRadius: 12,
          width: "90%",
          maxWidth: 600,
          maxHeight: "95%",
          alignSelf: "center",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Título y materia */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text variant="titleLarge">
                {tareaInicial ? "Editar Tarea" : "Crear Tarea"}
              </Text>

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    compact
                    mode="text"
                    icon={({ size, color }) => (
                      <Ionicons name="book-outline" size={size} color={color} />
                    )}
                    onPress={() => setMenuVisible(true)}
                    contentStyle={{ flexDirection: "row-reverse" }}
                  >
                    {aulas.find((m) => m.id === materiaId)?.nombre ??
                      "Seleccionar Aula"}
                  </Button>
                }
              >
                {aulas.map((m) => (
                  <Menu.Item
                    key={m.id}
                    onPress={() => {
                      setMateriaId(m.id);
                      setMenuVisible(false);
                      if (asignarTodos) {
                        setAlumnosSeleccionados(m.alumnoIds ?? []);
                      }
                    }}
                    title={m.nombre}
                  />
                ))}
              </Menu>
            </View>

            {/* Inputs */}
            <TextInput
              label="Título"
              mode="outlined"
              value={titulo}
              onChangeText={setTitulo}
              style={{ marginBottom: 12 }}
              returnKeyType="next"
            />

            <TextInput
              label="Descripción"
              mode="outlined"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
              style={{ marginBottom: 12 }}
            />

            <Menu
              visible={menuTipoVisible}
              onDismiss={() => setMenuTipoVisible(false)}
              mode="elevated"
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuTipoVisible(true)}
                  icon={({ size, color }) => (
                    <Ionicons name="layers-outline" size={size} color={color} />
                  )}
                  style={{ marginBottom: 12 }}
                  contentStyle={{ flexDirection: "row-reverse" }}
                >
                  {tipo || "Seleccionar tipo"}
                </Button>
              }
            >
              {tipos.map((t) => (
                <Menu.Item
                  key={t}
                  onPress={() => {
                    setTipo(t);
                    setMenuTipoVisible(false);
                  }}
                  title={t}
                />
              ))}
            </Menu>

            <DateInput
              label="Fecha límite"
              value={fechaLimite || ""}
              onChange={setFechaLimite}
              placeholder="DD/MM/YYYY"
            />

            {/* <CheckboxItem
              label="Asignar a todos los alumnos"
              status={asignarTodos ? "checked" : "unchecked"}
              onPress={() => {
                setAsignarTodos(!asignarTodos);
                setAlumnosSeleccionados(
                  !asignarTodos ? alumnosDeMateria.map((a) => a.id) : []
                );
              }}
            /> */}

            {materiaId && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <CheckboxItem
                    label="Asignar a todos los alumnos"
                    status={asignarTodos ? "checked" : "unchecked"}
                    onPress={() => {
                      const nuevoAsignarTodos = !asignarTodos;
                      setAsignarTodos(nuevoAsignarTodos);
                      if (nuevoAsignarTodos) {
                        const aula = aulas.find((a) => a.id === materiaId);
                        setAlumnosSeleccionados(
                          aula ? aula.alumnoIds ?? [] : []
                        );
                        setShowAlumnos(false);
                      } else {
                        setAlumnosSeleccionados([]);
                        setShowAlumnos(true); // Mostrar lista automáticamente al desmarcar
                      }
                    }}
                  />
                  {!asignarTodos && (
                    <TouchableRipple
                      onPress={() => setShowAlumnos(!showAlumnos)}
                      style={{ padding: 8 }}
                    >
                      <Ionicons
                        name={
                          showAlumnos
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                        }
                        size={24}
                        color={colors.primary}
                      />
                    </TouchableRipple>
                  )}
                </View>

                {!asignarTodos && showAlumnos && (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#e0e0e0",
                      borderRadius: 8,
                      marginBottom: 12,
                      maxHeight: 250,
                      paddingVertical: 4,
                    }}
                  >
                    <ScrollView
                      style={{ maxHeight: 170 }}
                      contentContainerStyle={{ paddingHorizontal: 8 }}
                      keyboardShouldPersistTaps="handled"
                      persistentScrollbar
                    >
                      {alumnosDeMateria.map((alumno) => (
                        <CheckboxItem
                          key={alumno.id}
                          label={`${alumno.nombre} ${alumno.apellido}`}
                          status={
                            alumnosSeleccionados.includes(alumno.id)
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => toggleAlumno(alumno.id)}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}

            {/* Botones */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 16,
                gap: 8,
              }}
            >
              <Button onPress={cerrar}>Cancelar</Button>
              <Button
                mode="contained"
                onPress={handleGuardar}
                disabled={
                  !titulo.trim() ||
                  !materiaId ||
                  !tipo ||
                  (alumnosSeleccionados.length === 0 && !asignarTodos)
                }
              >
                Guardar
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

export default CrearTareaModal;
