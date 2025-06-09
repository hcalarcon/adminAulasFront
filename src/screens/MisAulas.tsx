import { Layout } from "../layout/layout";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { useAuth } from "../context/authContent";
import MateriasCard from "../components/materiaCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../types/route";
import { MateriasSimpleType } from "../types/AulaType";
import { useWindowDimensions } from "react-native";
import { useAppData } from "../context/appDataContext";
import { useEffect, useState } from "react";
import { AsistenciaAlumnoType, AsistenciaType } from "../types/AsistenciaType";
import { getAsistenciasPorClase } from "../api/asistenciasClases";
import { getAsistenciasStorage, saveAsistencias } from "../utils/storage";

import { Ionicons } from "@expo/vector-icons";
type Props = NativeStackNavigationProp<RootStack, "MateriasStack">;

const Materias = () => {
  const { width } = useWindowDimensions();
  const numColums = width >= 900 ? 2 : 1;
  const { user, token } = useAuth();
  const navigation = useNavigation<Props>();
  const { aulas } = useAppData();

  const [isLoading, setIsLoading] = useState(true);
  const [asistencias, setAsistencias] = useState<AsistenciaAlumnoType[]>([]);

  const getAsistencias = async () => {
    setIsLoading(true);
    try {
      const data = await getAsistenciasPorClase(token);
      setAsistencias(data);
      await saveAsistencias(data); // actualizar local también
    } catch (error) {
      console.error("Error recargando asistencias", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAsistencias = async () => {
      setIsLoading(true);

      // 1. Intentar obtener desde local
      const local = await getAsistenciasStorage();
      if (local) {
        setAsistencias(local);
        setIsLoading(false);
        return;
      }

      // 2. Si no hay local, fetch desde backend
      getAsistencias();
    };

    if (!user?.is_teacher) fetchAsistencias();
  }, [isLoading]);

  const handlerNavigation = (
    item: MateriasSimpleType,
    asistencia: AsistenciaType[]
  ) => {
    navigation.navigate("MateriasStack", {
      screen: "DetalleMateria",
      params: { materia: item, asistencia: asistencia },
    });
  };

  return (
    <Layout>
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge" style={styles.title}>
            Mis Materias
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {user?.is_teacher
              ? "Lista de materias que dictas"
              : "Lista de materias que cursas"}
          </Text>
        </View>

        <Button
          mode="contained"
          style={styles.button}
          onPress={getAsistencias}
          icon={({ color, size }) => (
            <Ionicons name="refresh" color={color} size={size} />
          )}
        >
          Refrescar
        </Button>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 32,
          gap: 12,
          flexDirection: numColums > 1 ? "row" : "column",
          flexWrap: numColums > 1 ? "wrap" : "nowrap",
          justifyContent: numColums > 1 ? "center" : "flex-start",
        }}
      >
        {aulas.map((item) => {
          const asistenciaAula = asistencias.find((a) => a.aula_id === item.id);
          const porcentaje = asistenciaAula?.porcentaje_asistencia;
          const asistenciaAulaClases = asistencias.find(
            (a) => a.aula_id === item.id
          );
          const asistenciasA = asistenciaAulaClases?.asistencias || [];
          return (
            <View
              key={item.id}
              style={[
                styles.card,
                numColums > 1 && { width: width / 2 - 24, marginHorizontal: 6 },
              ]}
            >
              <MateriasCard
                materia={item}
                onPress={() => handlerNavigation(item, asistenciasA)}
                porcentaje={porcentaje}
                is_alumno={!user?.is_teacher}
                alarcoin={undefined}
              />
            </View>
          );
        })}
      </ScrollView>
    </Layout>
  );
};

export default Materias;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    color: "#6b7280",
  },
  card: {
    marginBottom: 16,
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
  scheduleText: {
    color: "#6b7280",
  },
  infoRight: {
    alignItems: "flex-end",
  },
  label: {
    color: "#6b7280",
  },
  classCount: {
    marginTop: 2,
    fontWeight: "600",
  },
  button: {
    borderRadius: 8,
    marginVertical: 10,
  },
});
