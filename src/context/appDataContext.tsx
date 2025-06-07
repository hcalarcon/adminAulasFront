import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContent";
import { User as AlumnoType } from "../types/UserType";
import { MateriasSimpleType, MateriasType } from "../types/AulaType";
import { getalumnosAulas, getMisAulas } from "../api/aulas";
import {
  getAlumnosStorage,
  getAulaStorage,
  getFromStorage,
  saveAlumnos,
  saveAula,
} from "../utils/storage";
import { Alarcoin } from "../types/AlarcoinType";
import { getHistorialProfesor, getAlarcoinsAlumno } from "../api/alarcoin";

interface AppDataContextType {
  aulas: MateriasSimpleType[];
  alumnosMap: Record<number, AlumnoType>;
  isLoading: boolean;
  loadData: (token: string) => void;
  alarcoins: Alarcoin[] | null;
  loadAlarcoins: () => void;
  alarcoinsError: boolean;
}

type AulaConAlumnos = {
  id: number;
  nombre: string;
  ano: number;
  division: number;
  especialidad: string;
  profesor_id: number;
  cantidad_clases: number;
  alumnos: AlumnoType[];
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token, user } = useAuth();
  const [aulas, setAulas] = useState<MateriasSimpleType[]>([]);
  const [alumnosMap, setAlumnosMap] = useState<Record<number, AlumnoType>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [alarcoins, setAlarcoins] = useState<Alarcoin[] | null>(null);
  const [alarcoinsError, setAlarcoinsError] = useState(false);

  const calcularCantidadAlarcoins = (alarcoins: any[]) => {
    return alarcoins.reduce((acc, item) => {
      return acc + (item.suma ? item.cantidad : -item.cantidad);
    }, 0);
  };
  const alarcoinProfe = async (data) => {
    const actualizarCantidadAlarcoins = (alarcoinsData: AulaConAlumnos[]) => {
      // const nuevoMap = { ...alumnosMap };
      const nuevoMap: Record<number, AlumnoType> = { ...alumnosMap };

      Object.keys(nuevoMap).forEach((id) => {
        nuevoMap[+id] = {
          ...nuevoMap[+id],
          alarcoin: 0, // 👈 limpiar antes de asignar
        };
      });

      alarcoinsData.forEach((aula) => {
        aula.alumnos.forEach((alumno) => {
          const cantidad = calcularCantidadAlarcoins(alumno?.alarcoins);
          if (nuevoMap[alumno.id]) {
            nuevoMap[alumno.id].alarcoin =
              (nuevoMap[alumno.id].alarcoin || 0) + cantidad;
          }
        });
      });

      setAlumnosMap(nuevoMap);
    };
    actualizarCantidadAlarcoins(data);
    setAlarcoins(data);
  };
  const alarcoinAlumno = async (data) => {
    setAlarcoins(data);
  };

  const loadAlarcoins = async () => {
    let efectiveToken = token;
    if (!token) {
      efectiveToken = await getFromStorage("token");
    }

    setAlarcoinsError(false);
    try {
      let data;
      if (user?.is_teacher) {
        data = await getHistorialProfesor(efectiveToken); // llama a /historial
        alarcoinProfe(data);
      } else {
        data = await getAlarcoinsAlumno(efectiveToken); // llama a /me
        alarcoinAlumno(data);
      }
    } catch (error) {
      console.error("Error cargando alarcoins:", error);
      setAlarcoinsError(true);
    }
  };

  const loadDataAlumno = async (tokenParam: string) => {
    try {
      const cachedAulas = await getAulaStorage();
      if (cachedAulas) {
        setAulas(cachedAulas);
        setIsLoading(false);
        return;
      }

      const aulasData: MateriasType[] = await getMisAulas(tokenParam);
      const aulasProcesadas = aulasData.map((aula) => ({
        ...aula,
        alumnos: [user], // el alumno actual
        alumnoIds: [user.id], // agregás este campo a mano para respetar el tipo MateriasSimpleType
      }));

      setAulas(aulasProcesadas);
      await saveAula(aulasProcesadas);
    } catch (error) {}
  };

  const loadDataProfe = async (tokenParam: string) => {
    try {
      const cachedAulas = await getAulaStorage();
      const cachedAulumnosMap = await getAlumnosStorage();

      if (cachedAulas && cachedAulumnosMap) {
        setAulas(cachedAulas);
        setAlumnosMap(cachedAulumnosMap);
        setIsLoading(false);
        return;
      }

      const aulasData: AulaConAlumnos[] = await getalumnosAulas(tokenParam);
      const alumnosMapTemp: Record<number, AlumnoType> = {};
      const aulasSinAlumnos = aulasData.map((aula) => {
        aula.alumnos.forEach((alumno) => {
          alumnosMapTemp[alumno.id] = alumno;
        });
        return {
          id: aula.id,
          nombre: aula.nombre,
          ano: aula.ano,
          division: aula.division,
          especialidad: aula.especialidad,
          profesor_id: aula.profesor_id,
          cantidad_clases: aula.cantidad_clases,
          alumnoIds: aula.alumnos.map((alumno) => alumno.id),
        };
      });
      setAulas(aulasSinAlumnos);
      setAlumnosMap(alumnosMapTemp);
      await saveAula(aulasSinAlumnos);

      await saveAlumnos(Object.values(alumnosMapTemp));
    } catch (error) {
      console.error("Error cargando datos desde appData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async (tokenParam?: string) => {
    const effectiveToken = tokenParam || token;
    if (!effectiveToken) return;

    if (user?.is_teacher) {
      await loadDataProfe(effectiveToken);
    } else {
      await loadDataAlumno(effectiveToken);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  return (
    <AppDataContext.Provider
      value={{
        aulas,
        alumnosMap,
        isLoading,
        loadData,
        alarcoins,
        loadAlarcoins,
        alarcoinsError,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context)
    throw new Error("useAppData debe usarse dentro de AppDataProvider");
  return context;
};
