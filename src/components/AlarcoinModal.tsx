import { useMemo, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  RadioButton,
  useTheme,
  SegmentedButtons,
  Card,
  Divider,
  Snackbar,
} from "react-native-paper";
import { User } from "../types/UserType";
import { useAppData } from "../context/appDataContext";
import {
  Alarcoin,
  AlarcoinAulaAlumnoType,
  AlarcoinCreateType,
  AlarcoinHistorialType,
} from "../types/AlarcoinType";
import { SelectMateria } from "./DropDonw";
import { crearAlarcoin } from "../api/alarcoin";
import { useAuth } from "../context/authContent";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  user: User | null;
  is_teacher: boolean | undefined;
  selectedAula?: AlarcoinAulaAlumnoType;
}

const AlarcoinModal = ({
  visible,
  onDismiss,
  user,
  is_teacher,
  selectedAula,
}: Props) => {
  if (!user) return null;
  const { colors } = useTheme();
  const [tab, setTab] = useState(is_teacher ? "asignar" : "historial");
  const [cantidad, setCantidad] = useState("0");
  const [concepto, setConcepto] = useState("");
  const [tipo, setTipo] = useState<string>("1");
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<number | null>(
    null
  );
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const { alarcoins, loadAlarcoins } = useAppData();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const historialPorAula = useMemo(() => {
    if (!user) return [];

    if (is_teacher) {
      // PROFESOR: busca en todas las aulas
      return alarcoins
        .map((aula) => {
          const alumno = aula.alumnos.find((a) => a.id === user.id);
          if (alumno) {
            return {
              aula_id: aula.aula_id,
              nombre: aula.nombre,
              alarcoins: alumno.alarcoins || [],
            };
          }
          return null;
        })
        .filter(
          (
            aula
          ): aula is {
            aula_id: number;
            nombre: string;
            alarcoins: AlarcoinHistorialType[];
          } => aula !== null
        );
    } else if (selectedAula) {
      return [
        {
          aula_id: selectedAula.id,
          nombre: selectedAula.nombre,
          alarcoins: selectedAula.alarcoins,
        },
      ];
    }

    return [];
  }, [alarcoins, user, is_teacher, selectedAula]);

  const handleGuardar = async () => {
    if (!materiaSeleccionada || materiaSeleccionada === 0) {
      setMensaje("Debes seleccionar una materia válida.");
      setVisibleSnack(true);
      return;
    }

    if (!concepto.trim()) {
      Alert.alert("Atención", "Debes ingresar un concepto.");
      return;
    }

    setLoading(true);

    const alarcoin: AlarcoinCreateType = {
      aula_id: materiaSeleccionada,
      alumno_id: user.id,
      detalle: concepto,
      suma: Number(tipo),
      cantidad: Number(cantidad),
    };
    try {
      await crearAlarcoin(token, alarcoin);
      setCantidad("0");
      setConcepto("");
      setTipo("true");
      setMateriaSeleccionada(null);
      onDismiss();
      loadAlarcoins();
      setMensaje("Alarcoin guardado correctamente.");
      setVisibleSnack(true);
    } catch (error) {
      setMensaje("error al guardar");
      setVisibleSnack(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
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
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          padding: 10,
          margin: 10,
          borderRadius: 12,
          width: "90%",
          maxWidth: 500,
          justifyContent: "flex-start",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexWrap: "nowrap",
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <SegmentedButtons
            value={tab}
            onValueChange={setTab}
            buttons={[
              { value: "historial", label: "Historial" },
              ...(is_teacher ? [{ value: "asignar", label: "Asignar" }] : []),
            ]}
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: "100%",
              borderRadius: 12,
              overflow: "hidden",
            }}
            contentStyle={{
              flexDirection: "row",
              flexWrap: "nowrap",
              minWidth: 0,
              maxWidth: "100%",
            }}
          />
        </View>
        {tab === "asignar" && is_teacher && (
          <Card mode="contained" style={{ marginTop: 10, padding: 5 }}>
            <Text variant="titleMedium" style={{ marginBottom: 5 }}>
              {`Gestionar Alarcoins de: ${user.nombre} ${user.apellido}`}
            </Text>

            <SelectMateria
              historial={historialPorAula}
              onSeleccionar={setMateriaSeleccionada}
            />

            <Divider style={{ marginVertical: 16 }} />

            <Text variant="labelLarge" style={{ marginBottom: 4 }}>
              Cantidad
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Button
                mode="outlined"
                onPress={() =>
                  setCantidad((prev) => String(Math.max(0, Number(prev) - 1)))
                }
              >
                -
              </Button>

              <TextInput
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="numeric"
                mode="outlined"
                style={{ flex: 1 }}
              />

              <Button
                mode="outlined"
                onPress={() => setCantidad((prev) => String(Number(prev) + 1))}
              >
                +
              </Button>
            </View>

            <TextInput
              label="Concepto"
              mode="outlined"
              value={concepto}
              onChangeText={setConcepto}
              style={{ marginTop: 16 }}
            />

            <Text variant="labelLarge" style={{ marginTop: 16 }}>
              Tipo de operación
            </Text>
            <RadioButton.Group
              onValueChange={(value) => setTipo(value)}
              value={tipo}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <RadioButton.Item label="Sumar" value="1" />
                <RadioButton.Item label="Restar" value="0" />
              </View>
            </RadioButton.Group>

            <Divider style={{ marginVertical: 16 }} />

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button mode="contained" onPress={handleGuardar}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </View>
          </Card>
        )}
        {tab === "historial" && (
          <View style={{ marginTop: 12 }}>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              Historial de Alarcoins
            </Text>
            {historialPorAula.every((item) => item.alarcoins.length === 0) ? (
              <Text style={{ marginTop: 8 }}>No hay historial aún</Text>
            ) : (
              <ScrollView>
                {historialPorAula
                  .filter((aula) => aula.alarcoins.length > 0)
                  .map((aula) => {
                    // Calcular el total de alarcoins para el aula
                    const totalAlarcoins = aula.alarcoins.reduce(
                      (acc, entry) =>
                        acc +
                        (entry.suma > 0 ? entry.cantidad : -entry.cantidad),
                      0
                    );
                    return (
                      <Card key={aula.aula_id} style={{ marginBottom: 16 }}>
                        <Card.Title
                          title={
                            <View
                              key={aula.aula_id}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text>{aula.nombre}</Text>
                              <Text
                                style={{
                                  marginLeft: 8,
                                  fontWeight: "bold",
                                  color: totalAlarcoins >= 0 ? "green" : "red",
                                }}
                              >
                                {`(${totalAlarcoins})`}
                              </Text>
                            </View>
                          }
                        />
                        <Card.Content>
                          {aula.alarcoins.map((entry) => (
                            <View key={entry.id}>
                              <View
                                key={entry.id}
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  marginVertical: 4,
                                }}
                              >
                                <Text>
                                  {new Date(entry.fecha).toLocaleDateString()}
                                </Text>
                                <Text>{entry.detalle}</Text>
                                <Text
                                  style={{
                                    color: entry.suma > 0 ? "green" : "red",
                                  }}
                                >
                                  {entry.suma > 0
                                    ? `+${entry.cantidad}`
                                    : `-${entry.cantidad}`}
                                </Text>
                              </View>
                              <Divider />
                            </View>
                          ))}
                        </Card.Content>
                      </Card>
                    );
                  })}
              </ScrollView>
            )}
          </View>
        )}
      </Modal>
    </Portal>
  );
};

export default AlarcoinModal;

//implementar a futuro

// import React, { useMemo, useState } from "react";
// import { Modal, Portal, Card, Text, Button, Divider } from "react-native-paper";
// import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
// import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// import { User } from "../types/UserType";
// import { AlarcoinAulaAlumnoType } from "../types/AlarcoinType";
// import { useAppData } from "../context/appDataContext";

// interface Props {
//   visible: boolean;
//   onDismiss: () => void;
//   user: User | null;
//   is_teacher: boolean | undefined;
//   selectedAula?: AlarcoinAulaAlumnoType;
// }

// const AlarcoinModal: React.FC<Props> = ({
//   visible,
//   onDismiss,
//   user,
//   is_teacher,
//   selectedAula,
// }) => {
//   const layout = Dimensions.get("window");
//   const [index, setIndex] = useState(0);

//   const [routes] = useState([
//     { key: "historial", title: "Historial" },
//     ...(is_teacher ? [{ key: "asignar", title: "Asignar" }] : []),
//   ]);

//   const { alarcoins } = useAppData();

//   const historial = useMemo(() => {
//     if (!selectedAula || !user) return [];
//     return alarcoins?.alarcoins ?? [];
//   }, [selectedAula, user]);

//   const renderHistorial = () => (
//     <ScrollView contentContainerStyle={styles.scroll}>
//       <Card>
//         <Card.Title title={selectedAula?.nombre || "Aula"} />
//         <Card.Content>
//           {historial.length === 0 ? (
//             <Text>No hay movimientos aún.</Text>
//           ) : (
//             historial.map((entry, index) => (
//               <View key={index} style={styles.entry}>
//                 <Text>{new Date(entry.fecha).toLocaleDateString()}</Text>
//                 <Text>{entry.motivo}</Text>
//                 <Text style={{ color: entry.cantidad > 0 ? "green" : "red" }}>
//                   {entry.cantidad > 0 ? `+${entry.cantidad}` : entry.cantidad}
//                 </Text>
//                 <Divider style={{ marginVertical: 4 }} />
//               </View>
//             ))
//           )}
//         </Card.Content>
//       </Card>
//     </ScrollView>
//   );

//   const renderAsignar = () => (
//     <View style={styles.asignar}>
//       <Text style={{ marginBottom: 8 }}>
//         Aquí podrías colocar el formulario de asignación:
//       </Text>
//       <Button mode="contained" onPress={() => {}}>
//         Asignar alarcoins
//       </Button>
//     </View>
//   );

//   const renderScene = SceneMap({
//     historial: renderHistorial,
//     asignar: renderAsignar,
//   });

//   return (
//     <Portal>
//       <Modal
//         visible={visible}
//         onDismiss={onDismiss}
//         contentContainerStyle={styles.modal}
//       >
//         <TabView
//           navigationState={{ index, routes }}
//           renderScene={renderScene}
//           onIndexChange={setIndex}
//           initialLayout={{ width: layout.width }}
//           renderTabBar={(props) => (
//             <TabBar
//               {...props}
//               indicatorStyle={{ backgroundColor: "white" }}
//               style={{ backgroundColor: "#6200ee" }}
//             />
//           )}
//         />
//       </Modal>
//     </Portal>
//   );
// };

// export default AlarcoinModal;

// const styles = StyleSheet.create({
//   modal: {
//     margin: 16,
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 16,
//     maxHeight: "90%",
//   },
//   scroll: {
//     paddingBottom: 24,
//   },
//   entry: {
//     marginVertical: 4,
//   },
//   asignar: {
//     padding: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
