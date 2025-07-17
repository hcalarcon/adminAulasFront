// src/components/alumno/CardResumen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, ProgressBar, useTheme } from "react-native-paper";

interface Props {
  titulo: string;
  valor: string;
  subtitulo?: string;
  progreso?: number; // 0 - 100
}

const CardResumen = ({ titulo, valor, subtitulo, progreso }: Props) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Title title={titulo} titleStyle={styles.titulo} />
      <Card.Content>
        <Text variant="headlineMedium" style={styles.valor}>
          {valor}
        </Text>
        {progreso != null && (
          <ProgressBar
            progress={progreso / 100}
            style={styles.progress}
            color={colors.primary}
          />
        )}
        {subtitulo && (
          <Text style={styles.subtitulo} variant="bodySmall">
            {subtitulo}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    maxWidth: 150,
  },
  titulo: {
    fontSize: 14,
    color: "#666",
  },
  valor: {
    fontWeight: "bold",
    marginTop: 4,
  },
  progress: {
    marginTop: 6,
    height: 6,
    borderRadius: 6,
  },
  subtitulo: {
    marginTop: 4,
    color: "#888",
  },
});

export default CardResumen;
