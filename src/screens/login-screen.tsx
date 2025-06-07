// screens/Login/LoginScreen.tsx

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../api/login";
import { useNavigation } from "@react-navigation/native";
import { Layout } from "../layout/layout";
import { saveToStorage, saveUser } from "../utils/storage";
import { useAuth } from "../context/authContent";
import { useAppData } from "../context/appDataContext";
import { Button } from "react-native-paper";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
});

export default function LoginScreen() {
  const navigation = useNavigation();
  const { loading, setUser, setToken } = useAuth();
  const { loadData } = useAppData();
  const handleLogin = async (
    values: { email: string; password: string },
    setSubmitting: (isSubmitting: boolean) => void,
    setError: (msg: string) => void,
    resetForm: () => void
  ) => {
    try {
      const response = await loginUser(values);
      resetForm();
      setUser(response.user);
      setToken(response.access_token);
      await saveUser(response.user);
      await saveToStorage("token", response.access_token);
      loadData(response.access_token);
      navigation.navigate("Main");
    } catch (error: any) {
      setError("Credenciales inválidas");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {loading ? (
        <Text>Cargando ...</Text>
      ) : (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={(values, { setSubmitting, setErrors, resetForm }) =>
                handleLogin(
                  values,
                  setSubmitting,
                  (msg) => setErrors({ password: msg }),
                  resetForm
                )
              }
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}

                  <Button onPress={handleSubmit}>
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Ingresar</Text>
                    )}
                  </Button>
                </>
              )}
            </Formik>
          </View>
        </View>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#fefefe80",
    elevation: 6, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
