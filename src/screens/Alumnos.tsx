import React, { useState } from "react";
import { View, FlatList, StyleSheet, useWindowDimensions } from "react-native";
import { Text, TextInput, Menu, Button } from "react-native-paper";
import { Layout } from "../layout/layout";
import AlumnoResumen from "../components/AlumnoResumen";

// Simulados
const materias = [
  { id: 1, nombre: "Matemática 1°A" },
  { id: 2, nombre: "Física 2°B" },
];

const alumnos = [
  {
    id: 1,
    nombre: "Alicia González",
    email: "alicia.g@colegio.edu",
    aulas: [
      {
        aulaId: 1,
        promedio: 85,
        asistencia: 91,
        completadas: 8,
        totalTareas: 10,
      },
      {
        aulaId: 2,
        promedio: 78,
        asistencia: 88,
        completadas: 6,
        totalTareas: 9,
      },
    ],
  },
  {
    id: 2,
    nombre: "Carlos Pérez",
    email: "carlos.p@colegio.edu",
    aulas: [
      {
        aulaId: 1,
        promedio: 72,
        asistencia: 75,
        completadas: 6,
        totalTareas: 10,
      },
    ],
  },
  {
    id: 3,
    nombre: "Brenda Martínez",
    email: "brenda.m@colegio.edu",
    aulas: [
      {
        aulaId: 2,
        promedio: 92,
        asistencia: 98,
        completadas: 9,
        totalTareas: 10,
      },
    ],
  },
  {
    id: 4,
    nombre: "Diego Fernández",
    email: "diego.f@colegio.edu",
    aulas: [
      {
        aulaId: 1,
        promedio: 63,
        asistencia: 70,
        completadas: 4,
        totalTareas: 10,
      },
    ],
  },
  {
    id: 5,
    nombre: "Lucía Ramírez",
    email: "lucia.r@colegio.edu",
    aulas: [
      {
        aulaId: 2,
        promedio: 88,
        asistencia: 95,
        completadas: 10,
        totalTareas: 10,
      },
    ],
  },
];

const Alumnos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMateria, setSelectedMateria] = useState<number | null>(
    materias[0]?.id ?? null
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const { width } = useWindowDimensions();

  const numColumns = width > 1024 ? 3 : 1;

  const filteredAlumnos = alumnos
    .map((alumno) => {
      const datosAula = alumno.aulas.find((a) => a.aulaId === selectedMateria);
      if (!datosAula) return null;
      return {
        ...alumno,
        ...datosAula,
      };
    })
    .filter(Boolean)
    .filter((alumno) =>
      alumno.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const selectedMateriaNombre =
    materias.find((m) => m.id === selectedMateria)?.nombre || "Todas";

  return (
    <Layout>
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text variant="titleLarge">Gestión de Alumnos</Text>
          <Text variant="bodyMedium">
            Buscar, gestionar y hacer seguimiento de los estudiantes
          </Text>
        </View>

        {/* Filtros */}
        <View style={styles.filters}>
          <TextInput
            mode="outlined"
            placeholder="Buscar alumno..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setMenuVisible(true)}>
                {selectedMateriaNombre}
              </Button>
            }
          >
            {materias.map((materia) => (
              <Menu.Item
                key={materia.id}
                onPress={() => {
                  setSelectedMateria(materia.id);
                  setMenuVisible(false);
                }}
                title={materia.nombre}
              />
            ))}
          </Menu>
        </View>

        {/* Lista */}
        <FlatList
          data={filteredAlumnos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <AlumnoResumen
                name={item.nombre}
                email={item.email}
                asistencia={item.asistencia}
                completadas={item.completadas}
                promedio={item.promedio}
                totalTareas={item.totalTareas}
                estado="Excelente"
                onPressDetalles={() => {
                  // ⚠️ Abrí modal o navegá a detalle acá
                  console.log("Ver detalles de:", item.nombre);
                }}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No se encontraron alumnos.
            </Text>
          }
        />
      </View>
    </Layout>
  );
};

export default Alumnos;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    minWidth: 200,
  },
  listContainer: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: 350,
    minWidth: 280,
    marginBottom: 16,
  },
});
