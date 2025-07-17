import React, { useEffect, useState } from "react";
import { View, FlatList, useWindowDimensions, StyleSheet } from "react-native";
import { Text, IconButton, useTheme } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAppData } from "../../context/appDataContext";
import { TareaBase } from "../../types/TareaType";
import CardResumen from "../../components/evaluacion/CardResumen";
import FiltroTareas from "../../components/evaluacion/FiltroTarea";
import CardTask from "../../components/evaluacion/CardTask";
import LoadError from "../../components/LoadError";
import { NotaType } from "../../types/NotaType";

const TareaAlumno = () => {
  const {
    loadTareas,
    tareas,
    tareasError,
    tareasLoading,
    aulas,
    notas,
    loadNotas,
  } = useAppData();

  const [tareasFiltradas, setTareasFiltradas] = useState<TareaBase[]>([]);

  useEffect(() => {
    loadNotas();
  }, []);

  const { width } = useWindowDimensions();
  const { colors } = useTheme();

  const isLargeScreen = width >= 768;
  const numColumns = isLargeScreen ? 2 : 1;

  // 1. Obtener IDs de las tareas visibles
  const tareaIds = tareasFiltradas.map((t) => t.id);

  // 2. Filtrar notas de las tareas visibles
  const notasFiltradas = Object.values(notas)
    .flat()
    .filter((n) => tareaIds.includes(n.tarea_id));

  console.log(notasFiltradas, tareaIds);

  // 3. Tareas completadas
  const tareasEntregadas = tareasFiltradas.filter((t) => {
    const hayNotaEntregada = notasFiltradas.some((n) => {
      const coincide = n.tarea_id == t.id && n.entregado;
      if (coincide) {
        console.log("→ Coincide:", n);
      }
      return coincide;
    });
    console.log("tarea id:", t.id, "¿hay nota entregada?", hayNotaEntregada);
    return hayNotaEntregada;
  });

  const totalTareas = tareasFiltradas.length;
  const completadas = tareasEntregadas.length;
  const porcentaje = totalTareas > 0 ? (completadas / totalTareas) * 100 : 0;

  // 4. Promedio de notas (solo si hay nota numérica)
  const notasValidas = notasFiltradas.filter((n) => typeof n.nota === "number");
  const promedio =
    notasValidas.length > 0
      ? Math.round(
          notasValidas.reduce((acc, n) => acc + n.nota, 0) / notasValidas.length
        )
      : 0;

  // 5. Próximos vencimientos sin nota
  const ahora = new Date();

  // Mostramos tareas cuya fecha límite es futura (aún no vencieron)
  const vencimientos = tareasFiltradas.filter(
    (t) => new Date(t.fecha_limite) > ahora
  );

  const handleRefresh = () => {
    loadNotas(true);
    loadTareas(true);
  };

  return (
    <View style={styles.container}>
      <LoadError
        isLoading={tareasLoading}
        hasError={tareasError}
        errorMessage="Error al cargar tareas"
        reLoad={() => loadTareas(true)}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: isLargeScreen ? 0.9 : 1 }}>
            <FiltroTareas onFiltrar={setTareasFiltradas} />
          </View>
          <View
            style={{
              flex: 0.1,
              height: isLargeScreen ? 40 : 94,

              justifyContent: "flex-start",
              alignContent: "flex-end",
            }}
          >
            <IconButton
              icon={({ size, color }) => (
                <Ionicons name="refresh" size={size} color={color} />
              )}
              mode="contained"
              onPress={() => handleRefresh()}
              style={{ padding: 0, margin: 0 }}
            />
          </View>
        </View>

        <View
          style={[
            styles.mainContent,
            isLargeScreen && { flexDirection: "row", gap: 24 },
          ]}
        >
          <View style={{ flex: 2 }}>
            {tareasFiltradas.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons
                  name="document-text-outline"
                  size={48}
                  color={colors.onSurfaceDisabled}
                  style={{ marginBottom: 12 }}
                />
                <Text variant="titleMedium">No se encontraron tareas</Text>
                <Text variant="bodySmall" style={{ color: colors.outline }}>
                  Intenta cambiar el filtro o la búsqueda
                </Text>
              </View>
            ) : (
              <FlatList
                data={tareasFiltradas}
                numColumns={numColumns}
                key={numColumns}
                keyExtractor={(item) =>
                  item.id?.toString() ?? `tarea-${item.titulo}`
                }
                columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
                renderItem={({ item }) => {
                  const notaTarea = notas[item.aula_id]?.find(
                    (nota: NotaType) => nota.tarea_id === item.id
                  );
                  return (
                    <CardTask
                      descripcion={item.descripcion ?? "sin descripción"}
                      fechaVencimiento={item.fecha_limite ?? "sin límite"}
                      tipo={item.tipo ?? "sin tipo"}
                      titulo={item.titulo}
                      key={item.id}
                      estado="Completada"
                      calificacionRecibida={notaTarea?.nota ?? undefined}
                      nombreAula={
                        aulas.find((a) => a.id === item.aula_id)?.nombre ?? "-"
                      }
                    />
                  );
                }}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
            )}
          </View>

          {/* Resumen (lado derecho en pantallas grandes) */}
          <View style={[styles.resumenContainer, isLargeScreen && { flex: 1 }]}>
            <CardResumen
              titulo="Tareas Completadas"
              valor={`${completadas}/${totalTareas}`}
              progreso={porcentaje}
            />

            <CardResumen
              titulo="Promedio"
              valor={`${promedio}`}
              subtitulo="Basado en tareas calificadas"
            />

            <CardResumen
              titulo="Próximos Vencimientos"
              valor={`${vencimientos.length.toString()}`}
              subtitulo="Tareas pendientes"
            />
          </View>
        </View>
      </LoadError>
    </View>
  );
};

export default TareaAlumno;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 1000,
    alignSelf: "center", // centra horizontalmente
    width: "100%", // asegura que ocupe todo el ancho disponible
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 5,
  },
  mainContent: {
    flex: 1,
  },
  resumenContainer: {
    gap: 12,
    marginTop: 16,
    alignItems: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  row: {
    justifyContent: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },
});
