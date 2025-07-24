import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Layout } from "../../layout/layout";
import { useAuth } from "../../context/authContent";
import { useAppData } from "../../context/appDataContext";
import { ActivityIndicator, Text } from "react-native-paper";

import { getSaludoFecha } from "../../utils/getSaludoFecha";
import LoadError from "../../components/LoadError";
import HomeProfesor from "./HomeProfesor";
import HomeAlumnos from "./HomeAlumnos";

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  const { user, loading } = useAuth();
  const { aulas, alumnosMap, isLoading } = useAppData();
  const cargando = isLoading && loading;

  const totalClasesDictadas = aulas.reduce((total, aula) => {
    return total + (aula.cantidad_clases || 0);
  }, 0);
  const { saludo, fecha } = getSaludoFecha();

  return (
    <Layout>
      <View style={styles.container}>
        {user?.is_teacher ? <HomeProfesor /> : <HomeAlumnos />}
        {/* <LoadError>
          <View style={[styles.header, isSmallScreen && styles.headerSmall]}>
            <View>
              <Text variant="titleMedium">{`${saludo}, ${user?.nombre}`}</Text>

              <Text variant="labelMedium">
                {user?.is_teacher ? "Profesor" : "Alumno"}
              </Text>
            </View>

            <View style={isSmallScreen && { marginTop: 8 }}>
              <Text variant="bodySmall">{fecha}</Text>
            </View>
          </View>
        </LoadError> */}
      </View>
    </Layout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 1000,
    alignSelf: "center", // centra horizontalmente
    width: "100%", // asegura que ocupe todo el ancho disponible
    paddingHorizontal: 16,
  },
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
  cardsContainer: {
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  alumnosListContainer: {
    marginTop: 16,
  },
});
//  {cargando ? (
//         <ActivityIndicator size={"large"} color={PrimaryColor} />
//       ) : (
//         <>
//           <View style={[styles.header, isSmallScreen && styles.headerSmall]}>
//             <View>
//               <Text variant="titleMedium">{`${saludo}, ${user?.nombre}`}</Text>
//               <Text variant="labelMedium">
//                 {user?.is_teacher ? "Profesor" : "Alumno"}
//               </Text>
//             </View>
//             <View style={isSmallScreen && { marginTop: 8 }}>
//               <Text variant="bodySmall">{fecha}</Text>
//             </View>
//           </View>
//           <View style={styles.cardsContainer}>
//             <ResumenMiniCard
//               title="Aulas"
//               value={aulas.length}
//               icon="school"
//               color={PrimaryColor}
//             />
//             <ResumenMiniCard
//               title="Clases"
//               value={totalClasesDictadas}
//               icon="calendar"
//               color="#C93A9F"
//             />
//             {/* <ResumenMiniCard
//               title="Alarcoins"
//               value={totalClasesDictadas}
//               icon="star"
//               color="#FFD700"
//             /> */}
//             {user?.is_teacher && (
//               <AlumnosList alumnos={Object.values(alumnosMap)} />
//             )}
//           </View>
//         </>
//       )}
