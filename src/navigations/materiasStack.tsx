import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Materias from "../screens/mis-materias";
import DetalleMateria from "../screens/DetailsMaterias";
import { MateriasStackParamList } from "../types/route";

const Stack = createNativeStackNavigator<MateriasStackParamList>();

export default function MateriasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Materias"
        component={Materias}
        options={{ title: "adminAulas | Mis Materias" }}
      />
      <Stack.Screen
        name="DetalleMateria"
        component={DetalleMateria}
        options={{ title: "adminAulas | Detalle de Materia" }}
      />
    </Stack.Navigator>
  );
}
