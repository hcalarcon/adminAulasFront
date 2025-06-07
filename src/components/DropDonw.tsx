import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Menu, Divider, HelperText } from "react-native-paper";

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
  }>({
    label: "Elegir materia",
    id: null,
  });

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (nombre: string, id: number | null) => {
    setSelected({ label: nombre, id });
    closeMenu();
    onSeleccionar(id);
  };

  useEffect(() => {
    // reiniciar selección si historial cambia
    setSelected({ label: "Elegir materia", id: 0 });
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
            icon="chevron-down"
            contentStyle={{
              flexDirection: "row-reverse", // Ícono a la derecha
              justifyContent: "space-between",
            }}
            style={{
              borderColor: error ? "#B00020" : undefined,
            }}
          >
            {selected.label}
          </Button>
        }
      >
        <Menu.Item
          key="default-item"
          onPress={() => handleSelect("Elegir materia", null)}
          title="Elegir materia"
        />
        <Divider />
        {historial.map((item) => (
          <Menu.Item
            key={item.aula_id}
            onPress={() => handleSelect(item.nombre, item.aula_id)}
            title={item.nombre}
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
