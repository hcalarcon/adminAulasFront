import { useEffect, useState } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { TextInput, Button, Menu } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppData } from "../../context/appDataContext";
import { tipoTareaTextoToValor } from "../../utils/tipoTarea";

interface FiltroTareasProps {
  onFiltrar: (tareasFiltradas: any[]) => void;
}

const tiposTarea = [
  "Todas",
  "Evaluación",
  "Trabajo Práctico",
  "Trabajo Teórico",
  "Actitudinal",
];

export default function FiltroTareas({ onFiltrar }: FiltroTareasProps) {
  const { tareas, aulas } = useAppData();
  const { width } = useWindowDimensions();
  const isSmall = width < 600;

  const [searchQuery, setSearchQuery] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todas");
  const [aulaFiltro, setAulaFiltro] = useState<number | null>(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAulaVisible, setMenuAulaVisible] = useState(false);

  useEffect(() => {
    if (!tareas) {
      onFiltrar([]);
      return;
    }

    const filtradas = tareas.filter((t) => {
      const coincideTipo =
        filtroTipo === "Todas" || t.tipo === tipoTareaTextoToValor[filtroTipo];
      const coincideBusqueda = t.titulo
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const coincideAula = aulaFiltro === null || t.aula_id === aulaFiltro;
      return coincideTipo && coincideBusqueda && coincideAula;
    });

    onFiltrar(filtradas);
  }, [searchQuery, filtroTipo, aulaFiltro, tareas]);

  return (
    <View
      style={[
        styles.filters,
        {
          flexDirection: isSmall ? "column" : "row",
          alignItems: isSmall ? "stretch" : "center",
          gap: isSmall ? 12 : 16,
        },
      ]}
    >
      <TextInput
        mode="outlined"
        placeholder="Buscar tareas..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[
          styles.searchInput,
          {
            minWidth: isSmall ? "100%" : 220,
            height: 40,
          },
        ]}
        right={
          <TextInput.Icon
            icon={({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            )}
          />
        }
      />

      <View
        style={{
          flexDirection: "row",
          gap: isSmall ? 8 : 12,
          flex: isSmall ? undefined : 1,
          width: isSmall ? "100%" : undefined,
          justifyContent: isSmall ? "flex-start" : "flex-end",
        }}
      >
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              icon={({ color, size }) => (
                <Ionicons name="filter" size={size} color={color} />
              )}
              style={{ minWidth: 120 }}
            >
              {filtroTipo}
            </Button>
          }
        >
          {tiposTarea.map((tipo) => (
            <Menu.Item
              key={tipo}
              onPress={() => {
                setFiltroTipo(tipo);
                setMenuVisible(false);
              }}
              title={tipo}
            />
          ))}
        </Menu>

        <Menu
          visible={menuAulaVisible}
          onDismiss={() => setMenuAulaVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuAulaVisible(true)}
              icon={({ color, size }) => (
                <Ionicons name="school-outline" size={size} color={color} />
              )}
              style={{ minWidth: 140 }}
            >
              {aulaFiltro
                ? aulas.find((a) => a.id === aulaFiltro)?.nombre
                : "Todas las aulas"}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setAulaFiltro(null);
              setMenuAulaVisible(false);
            }}
            title="Todas las aulas"
          />
          {aulas.map((aula) => (
            <Menu.Item
              key={aula.id}
              onPress={() => {
                setAulaFiltro(aula.id);
                setMenuAulaVisible(false);
              }}
              title={aula.nombre}
            />
          ))}
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
  },
});
