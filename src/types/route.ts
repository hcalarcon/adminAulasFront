import { NavigatorScreenParams } from "@react-navigation/native";
import { MateriasSimpleType } from "./AulaType";
import { AsistenciaType } from "./AsistenciaType";

export type RootStack = {
  Login: undefined;
  Main: undefined;
  CambiarContra: undefined;
  MateriasStack: NavigatorScreenParams<MateriasStackParamList>;
};
export type MateriasStackParamList = {
  Materias: undefined;
  DetalleMateria: { materia: MateriasSimpleType; asistencia: AsistenciaType[] };
};
export type DrawerParamList = {
  MateriasStack: undefined;
  Perfil: undefined;
  Home: undefined;
  Alarcoin: undefined;
};
