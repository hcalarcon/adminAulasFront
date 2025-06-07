import AsyncStorage from "@react-native-async-storage/async-storage";
import { User as UsuarioType } from "../types/UserType";
import { MateriasSimpleType as Aula } from "../types/AulaType";

export const saveUser = async (user: UsuarioType) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error guardando el usuario:", error);
  }
};

export const getUser = async (): Promise<UsuarioType | null> => {
  try {
    const user = await AsyncStorage.getItem("user");
    if (user !== null) {
      return JSON.parse(user);
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo el usuario:", error);
    return null;
  }
};

export const saveToStorage = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error guardando en storage:", error);
  }
};

export const getFromStorage = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error("Error obteniendo de storage:", error);
    return null;
  }
};

export const removeFromStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error eliminando de storage:", error);
  }
};

export const saveAula = async (aulas: Aula[]) => {
  try {
    await AsyncStorage.setItem("aulas", JSON.stringify(aulas));
  } catch (error) {
    console.log("error al guardar materias", error);
  }
};

export const getAulaStorage = async (): Promise<Aula[] | null> => {
  try {
    const aula = await AsyncStorage.getItem("aulas");
    if (aula != null) return JSON.parse(aula) as Aula[];
    return null;
  } catch (error) {
    console.log("no hay aulas", error);
    return null;
  }
};

export const saveAlumnos = async (alumnos: UsuarioType[]) => {
  try {
    const json = JSON.stringify(alumnos);
    await AsyncStorage.setItem("alumnos", json);
  } catch (error) {
    console.error("Error al guardar alumnos:", error);
  }
};

export const getAlumnosStorage = async (): Promise<Record<
  number,
  UsuarioType
> | null> => {
  try {
    const data = await AsyncStorage.getItem("alumnos");
    if (!data) return null;

    const alumnosArray: UsuarioType[] = JSON.parse(data);
    const alumnosMap: Record<number, UsuarioType> = {};

    alumnosArray.forEach((alumno) => {
      alumnosMap[alumno.id] = alumno;
    });

    return alumnosMap;
  } catch (error) {
    console.error("Error al leer alumnos desde storage:", error);
    return null;
  }
};
