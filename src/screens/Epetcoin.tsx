import { Layout } from "../layout/layout";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, useWindowDimensions, View } from "react-native";
import { useAppData } from "../context/appDataContext";
import { useAuth } from "../context/authContent";
import AvatarCard from "../components/AvatarCard";
import AlarcoinModal from "../components/EpetcoinModal";
import { User } from "../types/UserType";
import LoadError from "../components/LoadError";
import MateriasCard from "../components/MateriaCard";
import {
  TransaccionCoinAlumnoType,
  TransaccionCoinAulaAlumnoType,
} from "../types/EpetcoinType";
import ResponsiveGrid from "../components/ResponsiveGrid";
import { MateriasAlumnosType } from "../types/AulaType";
import { Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import CrearEpetcoinForm from "../components/CrearEpetcoinForm";

const Alarcoin = () => {
  const { user } = useAuth();
  const {
    alumnosMap,
    loadAlarcoins,
    alarcoinsError,
    aulas,
    epetCoin,
    transaccioncoins,
  } = useAppData();
  const [selectedAlumno, setSelectedAlumno] = useState<User | null>(null);
  const [selectedAula, setSelectedAula] =
    useState<TransaccionCoinAulaAlumnoType>();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { width } = useWindowDimensions();

  const numColumns = useMemo(() => {
    if (width >= 1000) return 3;
    if (width >= 600) return 2;
    return 1;
  }, [width]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      loadAlarcoins();
      setIsLoading(false);
    };

    fetch();
  }, []);
  const handleOpenModal = (item: User | TransaccionCoinAlumnoType) => {
    if (user?.is_teacher) {
      setSelectedAlumno(item as User);
    } else {
      setSelectedAlumno(user);
      setSelectedAula(item as TransaccionCoinAulaAlumnoType);
    }
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const renderItem = (item: User | TransaccionCoinAlumnoType) => {
    if (!user?.is_teacher) {
      const materia = aulas.find(
        (a) => a.id === (item as TransaccionCoinAulaAlumnoType).aula_id
      );
      if (!materia) return null;

      const epetcoins = (item as TransaccionCoinAulaAlumnoType).epetcoins ?? [];

      const total = epetcoins.reduce(
        (acc, a) => acc + (a.suma ? a.cantidad : -a.cantidad),
        0
      );

      return (
        <Pressable
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.5 : 1 }]}
          onPress={() => handleOpenModal(item)}
        >
          <MateriasCard
            coin={(item as TransaccionCoinAlumnoType).nombre_moneda}
            materia={materia}
            is_alumno={true}
            alarcoin={total}
          />
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
            alarcoins={(item as User).epetcoin}
            desdeProfe={true}
          />
        </Pressable>
      );
    }
  };

  const dataList: (
    | MateriasAlumnosType
    | User
    | TransaccionCoinAulaAlumnoType
  )[] = user?.is_teacher ? Object.values(alumnosMap) : transaccioncoins ?? [];

  return (
    <Layout>
      <LoadError
        isLoading={isLoading}
        hasError={alarcoinsError}
        errorMessage="Error al cargar los epetCoins"
        reLoad={() => loadAlarcoins(true)}
      >
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 40,
            }}
          >
            <Ionicons
              name="refresh-circle"
              size={48}
              color="#888"
              style={{ marginBottom: 10 }}
            />
            <Text variant="titleMedium">Cargando...</Text>
          </View>
        ) : (
          <>
            {user?.is_teacher ? (
              epetCoin?.nombre ? (
                <Text>{epetCoin.nombre}</Text>
              ) : (
                <CrearEpetcoinForm onCreated={loadAlarcoins} />
              )
            ) : null}

            {(!user?.is_teacher || epetCoin?.nombre) && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="titleMedium">
                    {user?.is_teacher ? "Tus Alumnos" : "Tus EpetCoin"}
                  </Text>
                  {Platform.OS !== "android" && Platform.OS !== "ios" && (
                    <View style={{ marginBottom: 10, width: 200 }}>
                      <Button
                        mode="contained"
                        style={{
                          borderRadius: 8,
                          marginVertical: 10,
                        }}
                        onPress={() => loadAlarcoins(true)}
                        icon={({ color, size }) => (
                          <Ionicons name="refresh" color={color} size={size} />
                        )}
                      >
                        Refrescar
                      </Button>
                    </View>
                  )}
                </View>
                {/* Agregar validad si hay transaccion para mostrar */}
                {!user?.is_teacher && transaccioncoins?.length === 0 ? (
                  <Text style={{ marginTop: 20, textAlign: "center" }}>
                    Aún no tenés EpetCoins asignadas.
                  </Text>
                ) : (
                  <ResponsiveGrid
                    items={dataList}
                    numColumns={numColumns}
                    renderItem={renderItem}
                    getKey={(item) =>
                      user?.is_teacher
                        ? (item as User).id
                        : (item as TransaccionCoinAulaAlumnoType).aula_id
                    }
                    refreshing={isLoading}
                    onRefresh={() => loadAlarcoins(true)}
                    alumno={!user?.is_teacher}
                  />
                )}
              </>
            )}

            <AlarcoinModal
              visible={visible}
              onDismiss={handleCloseModal}
              user={selectedAlumno}
              is_teacher={user?.is_teacher}
              selectedAula={selectedAula}
            />
          </>
        )}
      </LoadError>
    </Layout>
  );
};

export default Alarcoin;
