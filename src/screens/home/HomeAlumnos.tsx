import { IconButton, Text } from "react-native-paper";
import LoadError from "../../components/LoadError";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useAppData } from "../../context/appDataContext";
import { useAuth } from "../../context/authContent";
import { getSaludoFecha } from "../../utils/getSaludoFecha";
import { useEffect, useState } from "react";
import ResumenMiniCard from "../../components/home/ResumenMiniCard";
import { getAsistenciasPorClase } from "../../api/asistenciasClases";
import { AsistenciaAlumnoType } from "../../types/AsistenciaType";
import { getAsistenciasStorage, saveAsistencias } from "../../utils/storage";
import { MisNotas, NotaType } from "../../types/NotaType";
import { Ionicons } from "@expo/vector-icons";

const HomeAlumnos = () => {
  const { user, token } = useAuth();
  const {
    loadAlarcoins,
    loadNotas,
    loadTareas,
    tareas,
    notas,
    epetCoin,
    transaccioncoins,
    aulas,
  } = useAppData();
  const { saludo, fecha } = getSaludoFecha();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 450;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [asistencia, setAsistencias] = useState<AsistenciaAlumnoType[]>([]);
  const [promedio, setPromedio] = useState<number>();
  const [promedioAsistencia, setPromedioAsistencia] = useState<number>();

  const getAsistencias = async () => {
    try {
      const data = await getAsistenciasPorClase(token);
      setAsistencias(data);
      await saveAsistencias(data); // actualizar local también
      setPromedioAsistencia(calcularPromedioAsistencia(data)); // actualizar promedio
    } catch (error) {
      console.error("Error recargando asistencias", error);
    }
  };

  const calcularPromedioNotas = (notasObj: MisNotas[]): number => {
    const todasLasNotas = Object.values(notasObj).flat(); // Flattenea los arrays
    const suma = todasLasNotas.reduce((acc, nota) => acc + nota.nota, 0);
    const cantidad = todasLasNotas.length;

    if (cantidad === 0) return 0;
    const prom = suma / cantidad;
    return Number.parseFloat(prom.toFixed(2));
  };

  const loadData = async (refresh = false) => {
    setIsLoading(true);
    try {
      loadAlarcoins(refresh);
      loadNotas(refresh);
      loadTareas(refresh);

      if (!refresh) {
        const local = await getAsistenciasStorage();
        if (local) {
          setAsistencias(local);
          setPromedioAsistencia(calcularPromedioAsistencia(local)); // calcular promedio desde local
          return;
        }
      }
      await getAsistencias(); // con await para asegurar el flujo
    } catch (error) {
      setError(true);
      console.log("error al cargar datos", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calcularPromedioAsistencia = (
    asistenciasPorMateria: AsistenciaAlumnoType[]
  ) => {
    // Filtramos materias con asistencia ≥ 10%
    const materiasValidas = asistenciasPorMateria.filter(
      (m) => m.porcentaje_asistencia >= 10
    );

    if (materiasValidas.length === 0) return 0;

    const sumaPorcentajes = materiasValidas.reduce(
      (acc, m) => acc + m.porcentaje_asistencia,
      0
    );

    const promedio = sumaPorcentajes / materiasValidas.length;
    return Math.round(promedio * 100) / 100; // redondear a 2 decimales
  };

  const totalCoins = transaccioncoins?.reduce(
    (acc, item) => acc + item.epetcoins.length,
    0
  );
  const totalClasesDictadas = aulas.reduce((total, aula) => {
    return total + (aula.cantidad_clases || 0);
  }, 0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!notas || notas.length === 0) return;
    const promedio = calcularPromedioNotas(notas);
    setPromedio(promedio);
  }, [notas]);
  return (
    <LoadError hasError={error} isLoading={isLoading} reLoad={loadData}>
      <View style={[styles.header]}>
        <View>
          <Text variant="titleMedium">{`${saludo}, ${user?.nombre}`}</Text>

          <Text variant="labelMedium">alumno</Text>
        </View>
        <IconButton
          icon={({ size, color }) => (
            <Ionicons name="refresh" size={size} color={color} />
          )}
          mode="contained"
          onPress={() => loadData(true)}
          style={{ padding: 0, margin: 0 }}
        />
      </View>
      <View style={styles.resumenContainer}>
        <ResumenMiniCard
          title="Epetcoins"
          icon="logo-bitcoin"
          value={totalCoins as number}
        />
        <ResumenMiniCard
          title="Clases"
          icon="school-outline"
          value={totalClasesDictadas}
        />
        <ResumenMiniCard
          title="Asistencias"
          icon="bookmark-outline"
          value={promedioAsistencia as number}
        />
        <ResumenMiniCard
          title="Notas"
          icon="clipboard-outline"
          value={promedio as number}
        />
      </View>
    </LoadError>
  );
};

export default HomeAlumnos;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 10,
  },
  headerSmall: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  resumenContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 15,
    marginBottom: 10,
  },
  alumnosListContainer: {
    marginTop: 16,
  },
});
