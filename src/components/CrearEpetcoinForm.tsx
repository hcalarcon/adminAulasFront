import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../context/authContent"; // o el path correcto
import { crearEpetcoin } from "../api/epetcoins";

const CrearEpetcoinForm = ({ onCreated }: { onCreated: () => void }) => {
  const { user } = useAuth();
  const apellido = user?.apellido || "Mi";
  const sugerido = `${apellido}Coin`;

  const [nombre, setNombre] = useState(sugerido);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCrear = async () => {
    if (!nombre.trim()) {
      setError("Debes ingresar un nombre válido");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await crearEpetcoin(nombre); // hace POST al backend
      onCreated(); // callback al padre para recargar
    } catch (e) {
      setError("Error al crear la moneda");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Text variant="titleMedium">Activar tu moneda personalizada</Text>

      <TextInput
        label="Nombre de la moneda"
        value={nombre}
        onChangeText={setNombre}
        mode="outlined"
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleCrear}
        loading={loading}
        disabled={loading}
      >
        Crear Epetcoin
      </Button>
    </View>
  );
};

export default CrearEpetcoinForm;
