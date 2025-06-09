import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Menu,
  Divider,
  HelperText,
  useTheme,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  historial: { aula_id: number; nombre: string }[];
  onSeleccionar: (id: number | null) => void;
  error?: boolean;
}

export const SelectMateria = ({ historial, onSeleccionar, error }: Props) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<{
    label: string;
    id: number | null;
  }>({ label: "Elegir materia", id: null });

  const { colors } = useTheme();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (nombre: string, id: number | null) => {
    setSelected({ label: nombre, id });
    closeMenu();
    onSeleccionar(id);
  };

  useEffect(() => {
    setSelected({ label: "Elegir materia", id: null });
  }, [historial]);

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode={error ? "contained-tonal" : "outlined"}
            onPress={openMenu}
            contentStyle={styles.buttonContent}
            style={[styles.button, error && { borderColor: colors.error }]}
          >
            <View style={styles.labelWithIcon}>
              <Ionicons
                name="book-outline"
                size={18}
                color={error ? colors.error : colors.onSurface}
                style={styles.iconLeft}
              />
              <View style={styles.labelTextWrapper}>
                <Ionicons
                  name={visible ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={error ? colors.error : colors.onSurface}
                  style={styles.iconRight}
                />
                <View>
                  <Button
                    mode="text"
                    style={styles.innerLabel}
                    disabled
                    labelStyle={{ color: colors.onSurface }}
                  >
                    {selected.label}
                  </Button>
                </View>
              </View>
            </View>
          </Button>
        }
      >
        <Menu.Item
          key="default-item"
          onPress={() => handleSelect("Elegir materia", null)}
          title="Elegir materia"
          leadingIcon={() => (
            <Ionicons name="refresh-outline" size={18} color={colors.primary} />
          )}
        />
        <Divider />
        {historial.map((item) => (
          <Menu.Item
            key={item.aula_id}
            onPress={() => handleSelect(item.nombre, item.aula_id)}
            title={item.nombre}
            leadingIcon={() => (
              <Ionicons
                name="school-outline"
                size={18}
                color={colors.primary}
              />
            )}
          />
        ))}
      </Menu>

      {error && (
        <HelperText type="error" visible={error}>
          Debes seleccionar una materia.
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderWidth: 1,
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginRight: 4,
  },
  innerLabel: {
    paddingHorizontal: 0,
  },
});
