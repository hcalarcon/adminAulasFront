import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, useWindowDimensions } from "react-native";
import {
  Text,
  Button,
  useTheme,
  IconButton,
  Snackbar,
  Portal,
  Dialog,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import TareaCard from "../../components/evaluacion/TareaCard";
import CrearTareaModal from "../../components/evaluacion/CrearTareaModal";
import { useAppData } from "../../context/appDataContext";
import LoadError from "../../components/LoadError";
import { TareaBase, tareaNueva } from "../../types/TareaType";
import { CrearTarea, EditarTarea, eliminarTarea } from "../../api/tarea";
import {
  asignarTareaMasiva,
  getNotas,
  eliminarNotasMasivas,
  actualizarNotasMasivas,
} from "../../api/notas";
import { NotaTareaUpdateMasiva, NotaType } from "../../types/NotaType";
import CalificarTareaModal from "../../components/evaluacion/CalificarTareaModal";
import FiltroTareas from "../../components/evaluacion/FiltroTarea";

const TareaProfe = () => {
  const { loadTareas, tareas, tareasError, tareasLoading, aulas } =
    useAppData();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [calificarVisible, setCalificarVisible] = useState<boolean>(false);
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [tareaAEliminar, setTareaAEliminar] = useState<TareaBase | null>(null);
  const [tareaEditar, setTareaEditar] = useState<tareaNueva | null>(null);
  const [tareaCalificar, setTareaCalificar] = useState<TareaBase | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tareasFiltradass, setTareasFiltradass] = useState<TareaBase[]>([]);

  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Definimos cuántas columnas usar según el ancho
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const isSmall = width < 600;

  useEffect(() => {
    loadTareas();
  }, []);

  const handlePressEliminar = (tarea: TareaBase) => {
    setTareaAEliminar(tarea);
    setConfirmVisible(true);
  };

  const onConfirmarEliminar = async () => {
    if (!tareaAEliminar) return;
    try {
      await eliminarTarea(tareaAEliminar.id as number);
      setMensaje("Tarea eliminada");
      setVisibleSnack(true);
      loadTareas(true); // refrescar lista
    } catch {
      setMensaje("Error al eliminar");
      setVisibleSnack(true);
    } finally {
      setConfirmVisible(false);
      setTareaAEliminar(null);
    }
  };

  const onEditar = (tarea: tareaNueva) => {
    setTareaEditar(tarea);
    setModalVisible(true);
  };

  const onCalificar = (tarea: TareaBase) => {
    setTareaCalificar(tarea);
    setCalificarVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTareaEditar(null);
  };

  const closeModalCalificar = () => {
    setCalificarVisible(false);
    loadTareas(true);
  };

  const handleGuardarNotas = async (
    notasActualizada: NotaTareaUpdateMasiva
  ) => {
    try {
      await actualizarNotasMasivas(notasActualizada);
      setMensaje("Notas actualizadas correctamente.");
    } catch (error) {
      console.error("Error al actualizar notas:", error);
      setMensaje("Error al actualizar notas.");
    } finally {
      setVisibleSnack(true);
      loadTareas(true);
    }
  };

  const handleGuardarTarea = async (tarea: tareaNueva & { id?: number }) => {
    try {
      let tarea_id = tarea.id;

      if (!tarea_id) {
        // Crear tarea (modo NUEVA)
        const nueva = await CrearTarea(tarea);
        tarea_id = nueva.id;

        if (Array.isArray(tarea.asignados) && tarea.asignados.length > 0) {
          await asignarTareaMasiva(tarea_id as number, tarea.asignados);
        }
      } else {
        // Editar tarea existente (modo EDICIÓN)
        const tareaParaEditar = {
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          tipo: tarea.tipo as string,
          fecha_limite: tarea.fecha_limite,
          aula_id: tarea.aula_id,
        };

        await EditarTarea(tarea_id, tareaParaEditar);

        // Obtener IDs de notas existentes (los alumnos ya asignados)
        const notas = await getNotas(tarea_id);
        const idsYaAsignados: number[] = notas.map(
          (n: NotaType) => n.alumno_id
        );

        const nuevosAlumnos = tarea.asignados.filter(
          (id) => !idsYaAsignados.includes(id)
        );

        const alumnosQuitados = idsYaAsignados.filter(
          (id) => !tarea.asignados.includes(id)
        );

        if (nuevosAlumnos.length > 0) {
          await asignarTareaMasiva(tarea_id, nuevosAlumnos);
        }

        if (alumnosQuitados.length > 0) {
          // Debes implementar esta función para eliminar notas
          await eliminarNotasMasivas(tarea_id, alumnosQuitados);
        }
      }

      setMensaje("Tarea guardada correctamente.");
      setVisibleSnack(true);
      loadTareas(true);
    } catch (error) {
      console.error(error);
      setMensaje("Error al guardar tarea");
      setVisibleSnack(true);
    }
  };

  return (
    <View style={styles.container}>
      <Snackbar
        visible={visibleSnack && mensaje !== ""}
        duration={1000}
        onDismiss={() => {
          setVisibleSnack(false);
          setMensaje("");
        }}
        action={{
          label: "Dale",
          onPress: () => setVisibleSnack(false),
        }}
      >
        {mensaje}
      </Snackbar>
      <LoadError
        isLoading={tareasLoading}
        hasError={tareasError}
        errorMessage="Error al cargar tareas"
        reLoad={() => loadTareas(true)}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={[styles.header]}>
            <View style={{ flex: 1 }}>
              <Text variant="titleLarge">Gestión de Tareas</Text>
              <Text variant="bodyMedium">Crear, gestionar y calificar</Text>
            </View>
            {isSmall ? (
              <IconButton
                mode="contained"
                onPress={() => setModalVisible(true)}
                icon={({ color, size }) => (
                  <Ionicons name="add" size={size} color={color} />
                )}
              ></IconButton>
            ) : (
              <Button
                mode="contained"
                onPress={() => setModalVisible(true)}
                icon={({ color, size }) => (
                  <Ionicons name="add" size={size} color={color} />
                )}
              >
                Crear Tarea
              </Button>
            )}

            <IconButton
              mode="contained"
              onPress={() => loadTareas(true)}
              icon={({ color, size }) => (
                <Ionicons name="refresh" size={size} color={color} />
              )}
            ></IconButton>
          </View>

          <FiltroTareas onFiltrar={setTareasFiltradass} />

          {/* Lista o vacío */}
          {tareasFiltradass.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color={theme.colors.onSurfaceDisabled}
                style={{ marginBottom: 12 }}
              />
              <Text variant="titleMedium">No se encontraron tareas</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                Intenta cambiar el filtro o la búsqueda
              </Text>
              <Button
                mode="contained"
                style={{ marginTop: 16 }}
                icon={({ color, size }) => (
                  <Ionicons name="add" size={size} color={color} />
                )}
                onPress={() => setModalVisible(true)}
              >
                Crear tu primera tarea
              </Button>
            </View>
          ) : (
            <FlatList
              data={tareasFiltradass}
              numColumns={numColumns}
              key={numColumns} // Esto fuerza un re-render al cambiar columnas
              keyExtractor={(item, index) =>
                item.id?.toString() ?? `tarea-${index}`
              }
              columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
              renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                  <TareaCard
                    cantidadAlumnos={item.cantidad_alumnos ?? 0}
                    descripcion={item.descripcion ?? "sis descripción"}
                    entregados={item.entregados ?? 0}
                    fechaEntrega={item.fecha_limite ?? "sin limite"}
                    tipo={item.tipo ?? "sin tipo"}
                    titulo={item.titulo}
                    key={item.id}
                    nombreAula={
                      aulas.find((a) => a.id === item.aula_id)?.nombre
                    }
                    onCalificar={() => onCalificar(item)}
                    onEliminar={() => handlePressEliminar(item)}
                    onEditar={() => onEditar(item as tareaNueva)}
                  />
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
        </View>

        <Portal>
          <Dialog
            visible={confirmVisible}
            onDismiss={() => setConfirmVisible(false)}
            style={{ borderRadius: 8 }}
          >
            <Dialog.Title>Confirmar eliminación</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                ¿Estás seguro de que querés eliminar la tarea "
                {tareaAEliminar?.titulo}"?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmVisible(false)}>Cancelar</Button>
              <Button onPress={onConfirmarEliminar} textColor="#B91C1C">
                Eliminar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <CrearTareaModal
          visible={modalVisible}
          onDismiss={closeModal}
          onGuardar={handleGuardarTarea}
          tareaInicial={tareaEditar}
        />
        {tareaCalificar && (
          <CalificarTareaModal
            visible={calificarVisible}
            onDismiss={() => closeModalCalificar()}
            tarea={tareaCalificar as TareaBase}
            onGuardar={handleGuardarNotas}
          />
        )}
      </LoadError>
    </View>
  );
};

export default TareaProfe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 1000,
    alignSelf: "center", // centra horizontalmente
    width: "100%", // asegura que ocupe todo el ancho disponible
    paddingHorizontal: 5,
  },
  row: {
    justifyContent: "space-between", // Cambiado de "center" a "flex-start"
    gap: 20, // Más espacio entre cards en desktop
    flexWrap: "wrap",
    marginTop: 15, // Separación visual respecto a los filtros
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  filters: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    borderRadius: 16,
    width: "100%",
  },
  card: {
    marginBottom: 30, // Más espacio debajo de cada card
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },

  cardWrapper: {
    flex: 1,
    paddingHorizontal: 4, // o gap entre columnas
    minWidth: 0, // previene overflows raros
  },
});
