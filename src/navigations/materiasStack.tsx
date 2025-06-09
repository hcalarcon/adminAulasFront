import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Materias from "../screens/MisAulas";
import DetalleMateria from "../screens/DetailsAulas";
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
