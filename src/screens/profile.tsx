import { Layout } from "../layout/layout";
import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from "react-native";
import {
  Text,
  Card,
  TextInput,
  Button,
  useTheme,
  Divider,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/authContent";
import { Ionicons } from "@expo/vector-icons";
import { UserUpdateType } from "../types/UserType";
import { updateUser } from "../api/updateUser";
import { useAppData } from "../context/appDataContext";

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es obligatorio"),
  apellido: Yup.string().required("El apellido es obligatorio"),
  email: Yup.string().email("Email inválido").required("Email requerido"),
  newPassword: Yup.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), ""],
    "Las contraseñas no coinciden"
  ),
});

const Profile = () => {
  const { user } = useAuth();
  const [editable, setEditable] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre);
  const [apellido, setApellido] = useState(user?.apellido);
  const [email, setEmail] = useState(user?.email);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useAuth();

  const handleEdit = () => setEditable(true);

  const handleCancel = () => {
    setEditable(false);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSave = async (values: UserUpdateType) => {
    const { newPassword, confirmPassword, ...rest } = values;

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden.");
        return;
      }
    }

    try {
      const updatedUser = await updateUser({
        ...rest,
        password: newPassword || undefined,
      });

      setUser(updatedUser);
      setEditable(false);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={[styles.container, ,]}>
        <Text
          variant="titleLarge"
          style={[styles.header, { color: colors.primary }]}
        >
          Perfil
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.subheader, { color: colors.onSurfaceVariant }]}
        >
          Administra tu información personal
        </Text>

        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardheader}>
            <Card.Title
              title="Información Personal"
              subtitle="Actualiza tu información de cuenta"
              titleStyle={[styles.cardTitle, { color: colors.primary }]}
              subtitleStyle={[
                styles.cardSubtitle,
                { color: colors.onSurfaceVariant },
              ]}
            />
          </View>
          <Divider
            style={{ marginBottom: 8, backgroundColor: colors.outlineVariant }}
          />
          <Card.Content>
            <Formik
              initialValues={{
                nombre: nombre || "",
                apellido: apellido || "",
                email: email || "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSave(values);
              }}
              enableReinitialize
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  <TextInput
                    label="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                    editable={editable}
                    mode="flat"
                    style={[
                      styles.input,
                      {
                        backgroundColor: editable
                          ? colors.background
                          : colors.surfaceDisabled,
                      },
                    ]}
                    error={!!errors.nombre && touched.nombre}
                    onBlur={handleBlur("name")}
                    left={
                      <TextInput.Icon
                        icon={({ color, size }) => (
                          <Ionicons
                            name="person-outline"
                            color={color}
                            size={size}
                          />
                        )}
                      />
                    }
                  />
                  {editable && errors.nombre && touched.nombre && (
                    <Text style={[styles.error, { color: colors.error }]}>
                      {errors.nombre}
                    </Text>
                  )}

                  <TextInput
                    label="Apellido"
                    value={apellido}
                    onChangeText={setApellido}
                    editable={editable}
                    mode="flat"
                    style={[
                      styles.input,
                      {
                        backgroundColor: editable
                          ? colors.background
                          : colors.surfaceDisabled,
                      },
                    ]}
                    error={!!errors.apellido && touched.apellido}
                    onBlur={handleBlur("apellido")}
                    left={
                      <TextInput.Icon
                        icon={({ color, size }) => (
                          <Ionicons
                            name="person-outline"
                            color={color}
                            size={size}
                          />
                        )}
                      />
                    }
                  />
                  {editable && errors.apellido && touched.apellido && (
                    <Text style={[styles.error, { color: colors.error }]}>
                      {errors.apellido}
                    </Text>
                  )}

                  <TextInput
                    label="Email"
                    value={email}
                    editable={editable}
                    onChangeText={setEmail}
                    mode="flat"
                    style={[
                      styles.input,
                      { backgroundColor: colors.surfaceDisabled },
                    ]}
                    error={!!errors.email && touched.email}
                    onBlur={handleBlur("email")}
                    left={
                      <TextInput.Icon
                        icon={({ color, size }) => (
                          <Ionicons
                            name="mail-outline"
                            color={color}
                            size={size}
                          />
                        )}
                      />
                    }
                  />
                  {editable && errors.email && touched.email && (
                    <Text style={[styles.error, { color: colors.error }]}>
                      {errors.email}
                    </Text>
                  )}

                  {editable && (
                    <>
                      <TextInput
                        label="Nueva clave"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholder="********"
                        mode="flat"
                        autoComplete="off"
                        textContentType="none"
                        importantForAutofill="no"
                        style={[
                          styles.input,
                          { backgroundColor: colors.background },
                        ]}
                        error={!!errors.newPassword && touched.newPassword}
                        onBlur={handleBlur("newPassword")}
                        left={
                          <TextInput.Icon
                            icon={({ color, size }) => (
                              <Ionicons
                                name="lock-closed-outline"
                                color={color}
                                size={size}
                              />
                            )}
                          />
                        }
                      />
                      {errors.newPassword && touched.newPassword && (
                        <Text style={[styles.error, { color: colors.error }]}>
                          {errors.newPassword}
                        </Text>
                      )}

                      <TextInput
                        label="Repetir clave"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="********"
                        mode="flat"
                        style={[styles.input, ,]}
                        left={
                          <TextInput.Icon
                            icon={({ color, size }) => (
                              <Ionicons
                                name="lock-closed-outline"
                                color={color}
                                size={size}
                              />
                            )}
                          />
                        }
                      />

                      <View style={styles.buttonGroup}>
                        <Button
                          mode="outlined"
                          style={[
                            styles.cancelButton,
                            { borderColor: colors.outline },
                            width < 400 && { flex: 1 },
                          ]}
                          onPress={handleCancel}
                          labelStyle={{ color: colors.primary }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          mode="contained"
                          style={[
                            styles.saveButton,
                            { backgroundColor: colors.primary },
                            width < 400 && { flex: 1 },
                          ]}
                          onPress={handleSubmit as any}
                          labelStyle={{ color: colors.onPrimary }}
                        >
                          Guardar
                        </Button>
                      </View>
                    </>
                  )}

                  {!editable && (
                    <Button
                      style={[
                        styles.editButton,
                        { backgroundColor: colors.primary },
                        width < 400 && { width: "100%", alignSelf: "center" },
                      ]}
                      mode="contained"
                      icon={({ color, size }) => (
                        <Ionicons name="pencil" color={color} size={size} />
                      )}
                      onPress={handleEdit}
                      labelStyle={{ color: colors.onPrimary, fontSize: 16 }}
                      contentStyle={{ paddingVertical: 8 }}
                    >
                      Editar
                    </Button>
                  )}
                </View>
              )}
            </Formik>
          </Card.Content>
        </Card>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    alignItems: "center",
    minHeight: "100%",
  },
  header: {
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 16,
    marginBottom: 4,
    alignSelf: "flex-start",
    letterSpacing: 0.5,
  },
  subheader: {
    marginBottom: 16,
    alignSelf: "flex-start",
    fontSize: 16,
    opacity: 0.85,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
  },
  cardheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 8,
    paddingTop: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
  },
  editButton: {
    marginTop: 16,
    borderRadius: 20,
    minWidth: 120,
    elevation: 0,
    alignSelf: "center",
  },
  card: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    marginTop: 16,
    paddingHorizontal: 0,
    borderRadius: 16,
    elevation: 2,
  },
  form: {
    gap: 8,
    marginTop: 8,
    width: "100%",
  },
  input: {
    marginBottom: 4,
  },
  error: {
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  buttonGroup: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  saveButton: {
    marginLeft: 8,
    borderRadius: 20,
    minWidth: 100,
  },
  cancelButton: {
    borderColor: "#ccc",
    borderRadius: 20,
    minWidth: 100,
  },
  logoutButton: {
    marginTop: 32,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e53935",
    color: "#e53935",
  },
});

export default Profile;
