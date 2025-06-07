// CustomDrawerContent.tsx
import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer, Switch } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import AvatarCard from "../components/avatarCard";
import { useAuth } from "../context/authContent";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../types/route";

export default function CustomDrawerContent(props: any) {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { user, loading, logout } = useAuth();

  const drawerItems = [
    {
      icon: "grid-outline",
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
      label: "Mis Aulas",
      screen: "MateriasStack",
    },
    {
      icon: "logo-bitcoin",
      label: user
        ? user.is_teacher
          ? "Alarcoins"
          : "Mis Alarcoins"
        : "Alarcoins",
      screen: "Alarcoin",
    },
  ];

  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Perfil */}
        <AvatarCard user={user} loading={loading} isalarcoins={false} />
        {/* Navegación */}
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

        {/* Cerrar sesión */}
        <Drawer.Section style={styles.bottom}>
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
            style={styles.themeItem}
            // agregamos el Switch como accesorio a la derecha
            right={(): React.ReactNode => (
              <Switch value={isDarkMode} onValueChange={toggleTheme} />
            )}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <Feather name="log-out" color={color} size={size} />
            )}
            label="Cerrar sesión"
            onPress={() => {
              logout();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              );
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
    paddingTop: 24,
  },
  nav: {
    marginTop: 16,
  },
  bottom: {
    marginTop: "auto",
    padding: 5,
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
