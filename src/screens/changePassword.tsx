import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/authContent";
import { Layout } from "../layout/layout";
import { updateUser } from "../api/updateUser";
import { useNavigation } from "@react-navigation/native";
import { saveUser, getFromStorage } from "../utils/storage";

const ChangePassword = () => {
  const { user, setUser, token } = useAuth();
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validToken, setValidToken] = useState<String | null>(token);

  useEffect(() => {
    if (validToken) return;
    const tokenToStorage = getFromStorage("token");
    setValidToken(tokenToStorage);
  });

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .matches(
        /[A-Z]/,
        "La contraseña debe contener al menos una letra mayúscula"
      )
      .required("Campo obligatorio"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden")
      .required("Campo obligatorio"),
  });

  const handleSubmit = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    setApiError(null);
    try {
      const updatedUser = await updateUser(
        {
          password: values.newPassword,
          cambiarContrasena: false,
        },
        token // No se manda token si es el primer inicio
      );

      setUser({ ...updatedUser });
      await saveUser(updatedUser);
      navigator.navigate("Main" as never);
    } catch (error: any) {
      setApiError(error.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title="Cambia tu contraseña"
            subtitle="Por seguridad, debes actualizarla"
          />
          <Card.Content>
            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <TextInput
                    label="Nueva contraseña"
                    secureTextEntry
                    value={values.newPassword}
                    onChangeText={handleChange("newPassword")}
                    onBlur={handleBlur("newPassword")}
                    style={styles.input}
                  />
                  {touched.newPassword && errors.newPassword && (
                    <Text style={styles.error}>{errors.newPassword}</Text>
                  )}

                  <TextInput
                    label="Repetir contraseña"
                    secureTextEntry
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    style={styles.input}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                  )}

                  {apiError && <Text style={styles.error}>{apiError}</Text>}

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    disabled={loading}
                    loading={loading}
                  >
                    Guardar contraseña
                  </Button>
                </View>
              )}
            </Formik>
          </Card.Content>
        </Card>
      </View>
    </Layout>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 600,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
