import AsyncStorage from "@react-native-async-storage/async-storage";
import { User as UsuarioType } from "../types/UserType";
import {
  MateriasSimpleType as Aula,
  ClaseType,
  MateriasAlumnosType,
} from "../types/AulaType";
import { Alarcoin, AlarcoinAulaAlumnoType } from "../types/AlarcoinType";
import { AsistenciaAlumnoType } from "../types/AsistenciaType";

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

export const saveAlarcoinsProfe = async (data: MateriasAlumnosType[]) => {
  try {
    const json = JSON.stringify(data);
    await saveToStorage("alarcoins_profe", json);
  } catch (error) {
    console.error("Error al guardar alarcoin en storage:", error);
  }
};

export const getAlarcoinsProfe = async (): Promise<
  MateriasAlumnosType[] | null
> => {
  try {
    const json = await getFromStorage("alarcoins_profe");
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Error al leer alarcoins profe:", error);
    return null;
  }
};

// Para alumno
export const saveAlarcoinsAlumno = async (data: AlarcoinAulaAlumnoType[]) => {
  try {
    const json = JSON.stringify(data);
    await saveToStorage("alarcoins_alumno", json);
  } catch (error) {
    console.error("Error al guardar alarcoin del alumno:", error);
  }
};

export const getAlarcoinsAlumno = async (): Promise<
  AlarcoinAulaAlumnoType[] | null
> => {
  try {
    const json = await getFromStorage("alarcoins_alumno");
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Error al leer alarcoin del alumno:", error);
    return null;
  }
};

export const saveAsistencias = async (data: AsistenciaAlumnoType[]) => {
  try {
    await AsyncStorage.setItem("asistencias", JSON.stringify(data));
  } catch (error) {
    console.error("Error al guardar asistencias:", error);
  }
};

export const getAsistenciasStorage = async (): Promise<
  AsistenciaAlumnoType[] | null
> => {
  try {
    const data = await AsyncStorage.getItem("asistencias");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error al leer asistencias:", error);
    return null;
  }
};

export const saveClases = async (
  materiaId: number,
  data: ClaseType[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(`clases_${materiaId}`, JSON.stringify(data));
  } catch (error) {
    console.error("Error guardando clases:", error);
  }
};

export const getClasesStorage = async (
  materiaId: number
): Promise<ClaseType[] | null> => {
  try {
    const data = await AsyncStorage.getItem(`clases_${materiaId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error leyendo clases:", error);
    return null;
  }
};
