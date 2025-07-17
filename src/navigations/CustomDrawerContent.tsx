import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer, Switch } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import AvatarCard from "../components/AvatarCard";
import { useAuth } from "../context/authContent";
import { useThemeContext } from "../context/themeContext";
import { useAppData } from "../context/appDataContext";

export default function CustomDrawerContent(props: any) {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { user, loading, logout } = useAuth();
  const { epetCoin } = useAppData();

  const drawerItems = [
    {
      icon: "home-outline",
      label: "Dashboard",
      screen: "Home",
    },
    {
      icon: "person-outline",
      label: "Perfil",
      screen: "Perfil",
    },
    {
      icon: "book-outline",
      label: "Asistencias y Clases",
      screen: "MateriasStack",
    },
    {
      icon: "clipboard-outline",
      label: "Tareas",
      screen: "Tareas",
    },
    {
      icon: "logo-bitcoin",
      label: user?.is_teacher
        ? epetCoin?.nombre
          ? epetCoin?.nombre
          : "epetCoins"
        : "Mis epetCoins",
      screen: "Alarcoin",
    },
    ...(user?.is_teacher
      ? [
          {
            icon: "people-outline",
            label: "Alumnos",
            screen: "Alumnos",
          },
        ]
      : []),
  ];
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Perfil */}
        <AvatarCard user={user} loading={loading} isalarcoins={false} />
        {/* Navegación */}
        <ScrollView>
          <Drawer.Section style={styles.nav}>
            {drawerItems.map((item, index) => (
              <DrawerItem
                key={index}
                icon={({ color, size }) => (
                  <Ionicons name={item.icon as any} color={color} size={size} />
                )}
                label={item.label}
                onPress={() => props.navigation.navigate(item.screen as any)}
              />
            ))}
          </Drawer.Section>
        </ScrollView>

        {/* Cerrar sesión */}
        <Drawer.Section style={styles.bottom}>
          <View style={[styles.switchRow, styles.themeItem]}>
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny"}
                  color={color}
                  size={size}
                />
              )}
              label={isDarkMode ? "Modo oscuro" : "Modo claro"}
              onPress={toggleTheme}
              style={{ flex: 1 }}
            />
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          </View>

          <DrawerItem
            icon={({ color, size }) => (
              <Feather name="log-out" color={color} size={size} />
            )}
            label="Cerrar sesión"
            onPress={() => {
              logout();
            }}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 14,
  },
  nav: {
    marginTop: 10,
  },
  bottom: {
    padding: 3,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  themeItem: {
    paddingRight: 8,
  },
});
