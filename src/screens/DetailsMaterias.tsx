import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, Button, ActivityIndicator, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MateriasStackParamList } from "../types/route";
import { useEffect, useState } from "react";
import { clasesMateria } from "../api/clasesMateria";
import { useAuth } from "../context/authContent";
import { ClaseType } from "../types/AulaType";
import ClaseCard from "../components/claseCard";
import { useWindowDimensions } from "react-native";
import { getFromStorage } from "../utils/storage";
import { Layout } from "../layout/layout";
type Props = RouteProp<MateriasStackParamList, "DetalleMateria">;

export default function DetallesMaterias() {
  const { width } = useWindowDimensions();
  const route = useRoute<Props>();
  const { materia, asistencia } = route.params;
  const navigation = useNavigation();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [clases, setClases] = useState<ClaseType[]>([]);
  const [error, setError] = useState(false);
  const { colors } = useTheme();

  const getClases = async () => {
    let efectiveToken = token;
    if (!token) {
      efectiveToken = await getFromStorage("token");
    }
    try {
      const data = await clasesMateria(materia.id, efectiveToken);
      setClases(data);
    } catch (error) {
      console.log("error al obtener las clases", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const clasesFiltradas = user?.is_teacher
    ? clases
    : clases.filter((clase) => !/^clases\s+\d+/i.test(clase.tema));

  const numColumns = width >= 1024 ? 3 : width >= 600 ? 2 : 1;
  const isSmallDevice = width < 600;
  useEffect(() => {
    getClases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddClass = () => {
    // lógica para agregar clase
  };

  // Agrupa las clases en filas según numColumns
  const getRows = (data: ClaseType[], columns: number) => {
    const rows = [];
    for (let i = 0; i < data.length; i += columns) {
      rows.push(data.slice(i, i + columns));
    }
    return rows;
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View
          style={[
            styles.sectionHeader,
            isSmallDevice && {
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
            },
          ]}
        >
          <View
            style={[
              styles.headerRow,
              isSmallDevice && { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Button
              onPress={handleGoBack}
              mode="text"
              compact
              icon={({ size, color }) => (
                <Ionicons name="arrow-back" size={16} color={colors.primary} />
              )}
              contentStyle={styles.backButton}
              labelStyle={[
                styles.backButtonText,
                isSmallDevice && { display: "none" },
              ]}
            >
              {!isSmallDevice && "Volver"}
            </Button>
            <Text
              variant={isSmallDevice ? "titleSmall" : "titleMedium"}
              style={[
                styles.subjectTitle,
                {
                  flexShrink: 1,
                  flexWrap: "wrap",
                  maxWidth: isSmallDevice ? "90%" : "100%",
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {materia.nombre}
            </Text>
          </View>

          <View>
            <View style={styles.scheduleRow}>
              <Ionicons name="clipboard" size={14} color="#6B7280" />
              <Text variant="bodySmall" style={styles.subjectSchedule}>
                {`${materia.ano}° ${materia.division}° - ${materia.especialidad}`}
              </Text>
            </View>
          </View>

          {user?.is_teacher && (
            <View>
              <Button
                icon="plus"
                mode="contained"
                onPress={handleAddClass}
                contentStyle={styles.addButtonContent}
                style={styles.addButton}
              >
                Agregar Clase
              </Button>
            </View>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator size={"large"} color="violet" />
        ) : error ? (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text
              variant="titleLarge"
              style={{
                marginBottom: 12,
                color: "#9333EA",
                textAlign: "center",
              }}
            >
              Ocurrió un error al cargar las clases
            </Text>
            <Image
              source={require("../../assets/errorImagen.png")}
              style={{
                width: 180,
                height: 180,
                marginBottom: 20,
                borderRadius: 90,
                opacity: 0.85,
              }}
              resizeMode="contain"
            />
            <Button
              mode="contained"
              onPress={() => {
                setIsLoading(true);
                setError(false);
                getClases();
              }}
              style={{ marginTop: 8 }}
            >
              Reintentar
            </Button>
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: user?.is_teacher ? 90 : 32,
                paddingHorizontal: 6,
                gap: 10,
              }}
              showsVerticalScrollIndicator={false}
            >
              {clasesFiltradas.length === 0 ? (
                <View style={styles.centered}>
                  <Ionicons
                    name="information-circle-outline"
                    size={48}
                    color="#A78BFA"
                  />
                  <Text
                    style={{
                      color: "#6B7280",
                      marginTop: 12,
                      textAlign: "center",
                    }}
                  >
                    No hay clases registradas aún.
                  </Text>
                </View>
              ) : (
                getRows(clasesFiltradas, numColumns).map((row, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={{
                      flexDirection: "row",
                      justifyContent: numColumns > 1 ? "center" : "flex-start",
                      marginBottom: 10,
                      gap: 10,
                    }}
                  >
                    {row.map((item) => {
                      const asistenciaDeEstaClase = asistencia.find(
                        (asistencia) => asistencia.id === item.id
                      );
                      return (
                        <View
                          key={item.id}
                          style={{
                            flex: 1,
                            maxWidth: `${100 / numColumns}%`,
                          }}
                        >
                          <View style={styles.cardShadow}>
                            <ClaseCard
                              clase={item}
                              asistencia={asistenciaDeEstaClase}
                            />
                          </View>
                        </View>
                      );
                    })}
                    {row.length < numColumns &&
                      Array.from({ length: numColumns - row.length }).map(
                        (_, idx) => (
                          <View
                            key={`empty-${idx}`}
                            style={{
                              flex: 1,
                              maxWidth: `${100 / numColumns}%`,
                              minHeight: 120,
                            }}
                          />
                        )
                      )}
                  </View>
                ))
              )}
            </ScrollView>
            {user?.is_teacher && (
              <View style={styles.fabContainer}>
                <Button
                  icon="plus"
                  mode="contained"
                  onPress={handleAddClass}
                  contentStyle={styles.addButtonContent}
                  style={styles.addButton}
                  labelStyle={{ fontWeight: "bold", fontSize: 16 }}
                >
                  Agregar Clase
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 0,
  },
  backButtonText: {
    color: "#4B5563",
    fontSize: 14,
    marginLeft: 4,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },

  subjectTitle: {
    fontWeight: "bold",
  },
  subjectSchedule: {
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  addButton: {
    borderRadius: 8,
    marginVertical: 10,
  },
  addButtonContent: {
    flexDirection: "row",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
