// import { Layout } from "../layout/layout";
// import { useEffect, useState } from "react";
// import { ScrollView, View, Pressable, useWindowDimensions } from "react-native";
// import { useAppData } from "../context/appDataContext";
// import { useAuth } from "../context/authContent";
// import AvatarCard from "../components/avatarCard";
// import AlarcoinModal from "../components/AlarcoinModal";
// import { User } from "../types/UserType";
// import LoadError from "../components/LoadError";
// import MateriasCard from "../components/materiaCard";
// import { AlarcoinAulaAlumnoType } from "../types/AlarcoinType";

// const Alarcoin = () => {
//   const { user } = useAuth();
//   const { alumnosMap, loadAlarcoins, alarcoins, alarcoinsError, aulas } =
//     useAppData();
//   const [selectedAlumno, setSelectedAlumno] = useState<User | null>(null);
//   const [selectedAula, setSelectedAula] = useState<
//     AlarcoinAulaAlumnoType | undefined
//   >();
//   const [visible, setVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const { width } = useWindowDimensions();

//   const fetchData = () => {
//     if (alarcoins) {
//       setIsLoading(false);
//       return;
//     }
//     setIsLoading(true);
//     loadAlarcoins();
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const getNumColumns = () => {
//     if (width >= 1000) return 3;
//     if (width >= 600) return 2;
//     return 1;
//   };

//   const numColumns = getNumColumns();

//   const handleOpenModal = ({
//     item,
//   }: {
//     item: User | AlarcoinAulaAlumnoType;
//   }) => {
//     if (user?.is_teacher) {
//       setSelectedAlumno(item);
//     } else {
//       setSelectedAlumno(user);
//       setSelectedAula(item);
//     }
//     setVisible(true);
//   };

//   const renderItem = (item: any) => {
//     if (!user?.is_teacher) {
//       const materia = aulas.find((a) => a.id === item.aula_id);
//       if (!materia) return null;

//       const total = item.alarcoins.reduce(
//         (acc, a) => acc + (a.suma ? a.cantidad : -a.cantidad),
//         0
//       );

//       return (
//         <Pressable
//           key={item.aula_id}
//           style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.5 : 1 }]}
//           onPress={() => handleOpenModal({ item })}
//         >
//           <MateriasCard materia={materia} is_alumno={true} alarcoin={total} />
//         </Pressable>
//       );
//     } else {
//       return (
//         <Pressable
//           key={item.id}
//           style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.5 : 1 }]}
//           onPress={() => handleOpenModal({ item })}
//         >
//           <AvatarCard
//             user={item}
//             loading={false}
//             isalarcoins={true}
//             alarcoins={item.alarcoin}
//           />
//         </Pressable>
//       );
//     }
//   };

//   const handleCloseModal = () => {
//     setVisible(false);
//   };

//   const dataList: User[] | AlarcoinAulaAlumnoType[] = user?.is_teacher
//     ? Object.values(alumnosMap)
//     : alarcoins ?? [];

//   // Agrupar los items en filas según numColumns
//   const rows = [];
//   for (let i = 0; i < dataList.length; i += numColumns) {
//     rows.push(dataList.slice(i, i + numColumns));
//   }

//   return (
//     <Layout>
//       <LoadError
//         isLoading={isLoading}
//         hasError={alarcoinsError}
//         errorMessage="Error al cargar los Alarcoins"
//         reLoad={fetchData}
//       >
//         <ScrollView
//           contentContainerStyle={{
//             paddingBottom: 32,
//             gap: 12,
//             flexDirection: numColumns > 1 ? "row" : "column",
//             flexWrap: numColumns > 1 ? "wrap" : "nowrap",
//             justifyContent: numColumns > 1 ? "center" : "flex-start",
//           }}
//         >
//           {rows.map((row, rowIndex) => (
//             <View
//               key={rowIndex}
//               style={{
//                 flexDirection: "row",
//                 justifyContent: numColumns > 1 ? "center" : "flex-start",
//                 marginBottom: 12,
//                 gap: 12,
//               }}
//             >
//               {row.map((item) => (
//                 <View
//                   key={user?.is_teacher ? item.id : item.aula_id}
//                   style={[
//                     numColumns > 1 && {
//                       width: width / 2 - 24,
//                       marginHorizontal: 6,
//                     },
//                   ]}
//                 >
//                   {renderItem(item)}
//                 </View>
//               ))}
//               {/* Si la última fila no está completa, rellenar con Views vacíos */}
//               {row.length < numColumns &&
//                 Array.from({ length: numColumns - row.length }).map(
//                   (_, idx) => <View key={`empty-${idx}`} style={{ flex: 1 }} />
//                 )}
//             </View>
//           ))}
//         </ScrollView>

//         <AlarcoinModal
//           visible={visible}
//           onDismiss={handleCloseModal}
//           user={selectedAlumno}
//           is_teacher={user?.is_teacher}
//           selectedAula={selectedAula}
//         />
//       </LoadError>
//     </Layout>
//   );
// };

// export default Alarcoin;

import { Layout } from "../layout/layout";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { useAppData } from "../context/appDataContext";
import { useAuth } from "../context/authContent";
import AvatarCard from "../components/avatarCard";
import AlarcoinModal from "../components/AlarcoinModal";
import { User } from "../types/UserType";
import LoadError from "../components/LoadError";
import MateriasCard from "../components/materiaCard";
import { AlarcoinAulaAlumnoType } from "../types/AlarcoinType";
import ResponsiveGrid from "../components/ResponsiveGrid";
import { getAlarcoinsAlumno, getAlarcoinsProfe } from "../utils/storage";
import { MateriasAlumnosType } from "../types/AulaType";
import { Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const Alarcoin = () => {
  const { user } = useAuth();
  const { alumnosMap, loadAlarcoins, alarcoins, alarcoinsError, aulas } =
    useAppData();
  const [selectedAlumno, setSelectedAlumno] = useState<User | null>(null);
  const [selectedAula, setSelectedAula] = useState<AlarcoinAulaAlumnoType>();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coin, setCoin] = useState<
    MateriasAlumnosType[] | null | AlarcoinAulaAlumnoType[]
  >(null);

  const { width } = useWindowDimensions();

  const numColumns = useMemo(() => {
    if (width >= 1000) return 3;
    if (width >= 600) return 2;
    return 1;
  }, [width]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (user?.is_teacher) {
        const local = await getAlarcoinsProfe();
        if (local && Array.isArray(local)) {
          setCoin(local);
          return;
        }
      } else {
        const local = await getAlarcoinsAlumno();
        if (local && Array.isArray(local)) {
          setCoin(local);
          return;
        }
      }

      loadAlarcoins(); // hace el fetch del backend y actualiza
      setCoin(alarcoins);
    } catch (error) {
      console.error("Error al cargar alarcoins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item: User | AlarcoinAulaAlumnoType) => {
    if (user?.is_teacher) {
      setSelectedAlumno(item as User);
    } else {
      setSelectedAlumno(user);
      setSelectedAula(item as AlarcoinAulaAlumnoType);
    }
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const renderItem = (item: User | AlarcoinAulaAlumnoType) => {
    if (!user?.is_teacher) {
      const materia = aulas.find(
        (a) => a.id === (item as AlarcoinAulaAlumnoType).aula_id
      );
      if (!materia) return null;

      const total = (item as AlarcoinAulaAlumnoType).alarcoins.reduce(
        (acc, a) => acc + (a.suma ? a.cantidad : -a.cantidad),
        0
      );

      return (
        <Pressable
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.5 : 1 }]}
          onPress={() => handleOpenModal(item)}
        >
          <MateriasCard materia={materia} is_alumno={true} alarcoin={total} />
        </Pressable>
      );
    } else {
      return (
        <Pressable
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.5 : 1 }]}
          onPress={() => handleOpenModal(item)}
        >
          <AvatarCard
            user={item as User}
            loading={false}
            isalarcoins={true}
            alarcoins={(item as User).alarcoin}
          />
        </Pressable>
      );
    }
  };

  const dataList: (MateriasAlumnosType | User | AlarcoinAulaAlumnoType)[] =
    user?.is_teacher ? Object.values(alumnosMap) : coin ?? [];

  return (
    <Layout>
      <LoadError
        isLoading={isLoading}
        hasError={alarcoinsError}
        errorMessage="Error al cargar los Alarcoins"
        reLoad={fetchData}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="titleMedium">
            {user?.is_teacher ? "Tus Alumnos" : "Alarcoin por aulas"}
          </Text>
          {Platform.OS !== "android" && Platform.OS !== "ios" && (
            <View style={{ marginBottom: 10, width: 200 }}>
              <Button
                mode="contained"
                style={{
                  borderRadius: 8,
                  marginVertical: 10,
                }}
                onPress={loadAlarcoins}
                icon={({ color, size }) => (
                  <Ionicons name="refresh" color={color} size={size} />
                )}
              >
                Refrescar
              </Button>
            </View>
          )}
        </View>

        <ResponsiveGrid
          items={dataList}
          numColumns={numColumns}
          renderItem={renderItem}
          getKey={(item) =>
            user?.is_teacher
              ? (item as User).id
              : (item as AlarcoinAulaAlumnoType).nombre
          }
          refreshing={isLoading}
          onRefresh={fetchData}
          alumno={!user?.is_teacher}
        />

        <AlarcoinModal
          visible={visible}
          onDismiss={handleCloseModal}
          user={selectedAlumno}
          is_teacher={user?.is_teacher}
          selectedAula={selectedAula}
        />
      </LoadError>
    </Layout>
  );
};

export default Alarcoin;
