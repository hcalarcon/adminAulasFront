import React from "react";
import { View, Image } from "react-native";
import { ActivityIndicator, Text, Button } from "react-native-paper";

type Props = {
  isLoading: boolean;
  hasError: boolean;
  reLoad: () => void;
  children: React.ReactNode;
  errorMessage?: string;
};

export default function LoadError({
  isLoading,
  hasError,
  reLoad,
  children,
  errorMessage = "Ocurrió un error al cargar los datos",
}: Props) {
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="violet" />
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          variant="titleLarge"
          style={{ marginBottom: 12, color: "#9333EA", textAlign: "center" }}
        >
          {errorMessage}
        </Text>
        <Image
          source={require("../../assets/errorImagen.png")}
          style={{
            width: 200,
            height: 200,
            marginBottom: 20,
            borderRadius: 100,
          }}
          resizeMode="contain"
        />
        <Button mode="contained" onPress={reLoad}>
          Reintentar
        </Button>
      </View>
    );
  }

  return <>{children}</>;
}
