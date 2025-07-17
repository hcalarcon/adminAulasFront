import AsyncStorage from "@react-native-async-storage/async-storage";
import { User as UsuarioType } from "../types/UserType";
import { MateriasSimpleType as Aula, ClaseType } from "../types/AulaType";
import {
  Epetcoin,
  TransaccionCoinAulaAlumnoType,
  TransaccionCoinHistorialAulaType,
} from "../types/EpetcoinType";
import { AsistenciaAlumnoType } from "../types/AsistenciaType";
import { TareaBase } from "../types/TareaType";
import { MisNotas } from "../types/NotaType";

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

export const getEpetCoinToStorage = async (): Promise<Epetcoin | null> => {
  try {
    const data = await AsyncStorage.getItem("epetCoin");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error leyendo epetCoin:", error);
    return null;
  }
};

export const saveEpetCoin = async (epetCoin: Epetcoin | undefined) => {
  try {
    await AsyncStorage.setItem("epetCoin", JSON.stringify(epetCoin));
  } catch (error) {
    console.error("Error guardando epetCoin:", error);
  }
};

export const saveTransaccionCoinProfe = async (
  data: TransaccionCoinHistorialAulaType[]
) => {
  try {
    const json = JSON.stringify(data);
    await saveToStorage("transaccion_profe", json);
  } catch (error) {
    console.error("Error al guardar alarcoin en storage:", error);
  }
};

export const getTransaccionCoinProfe = async (): Promise<
  TransaccionCoinHistorialAulaType[] | null
> => {
  try {
    const json = await getFromStorage("transaccion_profe");
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Error al leer alarcoins profe:", error);
    return null;
  }
};

// Para alumno
export const saveTransaccionCoinAlumno = async (
  data: TransaccionCoinAulaAlumnoType[]
) => {
  try {
    const json = JSON.stringify(data);
    await saveToStorage("transaccion_alumno", json);
  } catch (error) {
    console.error("Error al guardar alarcoin del alumno:", error);
  }
};

export const getTransaccionCoinAlumno = async (): Promise<
  TransaccionCoinAulaAlumnoType[] | null
> => {
  try {
    const json = await getFromStorage("transaccion_alumno");
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Error al leer alarcoin del alumno:", error);
    return null;
  }
};

export const saveTareas = async (tareas: TareaBase[]) => {
  try {
    await AsyncStorage.setItem("tareas", JSON.stringify(tareas));
  } catch (error) {
    console.error("Error al guardar tareas:", error);
  }
};

export const getTareasStorage = async (): Promise<TareaBase[] | null> => {
  try {
    const tareasStr = await AsyncStorage.getItem("tareas");
    return tareasStr ? JSON.parse(tareasStr) : null;
  } catch (error) {
    console.error("Error al leer tareas:", error);
    return null;
  }
};

export const getNotasAlumnoStorage = async (): Promise<MisNotas[] | null> => {
  try {
    const json = await AsyncStorage.getItem("notasAlumno");
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Error al leer notas:", error);
    return null;
  }
};

export const saveNotasAlumno = async (data: MisNotas) => {
  try {
    await AsyncStorage.setItem("notasAlumno", JSON.stringify(data));
  } catch (error) {
    console.error("Error al guardar notas:", error);
  }
};

export const clearNotasAlumnoStorage = async () => {
  await AsyncStorage.removeItem("notasAlumno");
};
