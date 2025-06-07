import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthProvider, useAuth } from "../context/authContent";
import HomeScreen from "../screens/home-screen";
import LoginScreen from "../screens/login-screen";
import Profile from "../screens/profile";
import { Pressable, View } from "react-native";
import CustomDrawerContent from "./CustomDrawerContent";
import Alarcoin from "../screens/alarcoin";
import ChangePassword from "../screens/changePassword";
import MateriasStack from "./materiasStack";
import { DrawerParamList, RootStack } from "../types/route";
import { AppDataProvider } from "../context/appDataContext";
import { Avatar, useTheme } from "react-native-paper";
import { useThemeContext } from "../context/themeContext";
import { getInitials } from "../utils/initials";
import { useMemo } from "react";

const Stack = createNativeStackNavigator<RootStack>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const memoizedUser = useMemo(() => user, [user]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: colors.elevation.level2,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },

        headerRight: () => (
          <View style={{ padding: 2 }}>
            <Pressable onPress={() => navigation.navigate("Perfil")} style={{}}>
              <Avatar.Text
                label={getInitials(
                  memoizedUser?.nombre,
                  memoizedUser?.apellido
                )}
                size={40}
                style={{
                  backgroundColor: colors.primary,
                  width: 40,
                  height: 40,
                  marginRight: 10,
                }}
              />
            </Pressable>
          </View>
        ),
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "adminAulas | Dashboard" }}
      />
      <Drawer.Screen
        name="MateriasStack"
        component={MateriasStack}
        options={{ title: "adminAulas | Mis Materias" }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Profile}
        options={{ title: "adminAulas | Mi Perfil" }}
      />
      <Drawer.Screen
        name="Alarcoin"
        component={Alarcoin}
        options={{ title: "adminAulas | Mis Alarcoin" }}
      />
    </Drawer.Navigator>
  );
}

const StackNavigation = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();

  // Integrar con React Navigation
  const navigationTheme = theme.dark
    ? {
        ...NavigationDarkTheme,
        colors: {
          ...NavigationDarkTheme.colors,
          ...theme.colors,
        },
      }
    : {
        ...NavigationDefaultTheme,
        colors: {
          ...NavigationDefaultTheme.colors,
          ...theme.colors,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : user.cambiarContrasena ? (
          <Stack.Screen
            name="CambiarContra"
            component={ChangePassword}
            options={{
              title: "adminAulas | Cambiar Contraseña",
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Main"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function Router() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <StackNavigation />
      </AppDataProvider>
    </AuthProvider>
  );
}
