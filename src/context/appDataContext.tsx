import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContent";
import { User as AlumnoType } from "../types/UserType";
import {
  MateriasAlumnosType,
  MateriasSimpleType,
  MateriasType,
} from "../types/AulaType";
import { getalumnosAulas, getMisAulas } from "../api/aulas";
import {
  getAlumnosStorage,
  getAulaStorage,
  saveAlumnos,
  saveAula,
  saveEpetCoin,
  getEpetCoinToStorage,
  getTransaccionCoinProfe,
  getTransaccionCoinAlumno,
  saveTransaccionCoinProfe,
  saveTransaccionCoinAlumno,
} from "../utils/storage";
import {
  TransaccionCoinType,
  TransaccionCoinAlumnoType,
  Epetcoin,
  TransaccionCoinCreateType,
  TransaccionCoinAulaAlumnoType,
  TransaccionCoinHistorialAulaType,
} from "../types/EpetcoinType";
import { getHistorialProfesor, getEpetcoin } from "../api/epetcoins";

interface AppDataContextType {
  aulas: MateriasSimpleType[];
  alumnosMap: Record<number, AlumnoType>;
  isLoading: boolean;
  loadData: (token: string) => void;
  transaccioncoins:
    | TransaccionCoinType[]
    | null
    | TransaccionCoinHistorialAulaType[]
    | TransaccionCoinAlumnoType[];
  loadAlarcoins: (forceRefresh?: boolean) => void;
  epetCoin: Epetcoin | null | undefined;
  alarcoinsError: boolean;
}

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
  const [transaccioncoins, setTransaccionCoins] = useState<
    | TransaccionCoinType[]
    | null
    | TransaccionCoinHistorialAulaType[]
    | TransaccionCoinAlumnoType[]
  >(null);
  const [alarcoinsError, setAlarcoinsError] = useState(false);
  const [epetCoin, setEpetcoin] = useState<Epetcoin | false | undefined>(false);

  //le pasamos una cantidad
  const calcularCantidadEpetcoins = (epetCoin: TransaccionCoinCreateType[]) => {
    return epetCoin.reduce((acc, item) => {
      return acc + (item.suma ? item.cantidad : -item.cantidad);
    }, 0);
  };

  //alarcoin si el usuario es profesor
  const transaccionCoinProfe = async (
    data: TransaccionCoinHistorialAulaType[]
  ) => {
    const actualizarCantidadEpetcoins = (
      alarcoinsData: TransaccionCoinHistorialAulaType[]
    ) => {
      const nuevoMap: Record<number, AlumnoType> = { ...alumnosMap };

      Object.keys(nuevoMap).forEach((id) => {
        nuevoMap[+id] = {
          ...nuevoMap[+id],
          epetcoin: 0,
        };
      });

      alarcoinsData.forEach((aula) => {
        aula.alumnos.forEach((alumno) => {
          const cantidad = calcularCantidadEpetcoins(alumno?.epetcoins);
          if (nuevoMap[alumno.id]) {
            nuevoMap[alumno.id].epetcoin =
              (nuevoMap[alumno.id].epetcoin || 0) + cantidad;
          }
        });
      });

      setAlumnosMap(nuevoMap);
    };
    actualizarCantidadEpetcoins(data);
    setTransaccionCoins(data);
    await saveTransaccionCoinProfe(data);
  };
  const alarcoinAlumno = async (data: TransaccionCoinAulaAlumnoType[]) => {
    setTransaccionCoins(data);
    await saveTransaccionCoinAlumno(data);
  };

  //nuevo modelo epetcoin
  const loadEpetcoin = async (): Promise<Epetcoin | boolean | undefined> => {
    try {
      const cachedCoin = await getEpetCoinToStorage();
      if (cachedCoin) {
        setEpetcoin(cachedCoin);
        return true;
      }
      const data = await getEpetcoin(); // fetch /me
      if (data?.coin) {
        return false;
      }
      await saveEpetCoin(data);
      setEpetcoin(data);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setEpetcoin(false); // No hay moneda activa
        return false;
      }
      console.error("Error verificando epetcoin:", error);
      return false;
    }
  };

  //cambiar a epetcoin
  const loadAlarcoins = async (forceRefresh: boolean = false) => {
    setAlarcoinsError(false);
    const tieneMoneda = await loadEpetcoin(); // paso nuevo
    if (!tieneMoneda) {
      return false; // no sigue si no hay moneda
    }

    try {
      if (user?.is_teacher) {
        if (forceRefresh) {
          const data = await getHistorialProfesor(); // API
          transaccionCoinProfe(data);
          await saveTransaccionCoinProfe(data);
        } else {
          const local = await getTransaccionCoinProfe();
          if (local) {
            transaccionCoinProfe(local);
          } else {
            const data = await getHistorialProfesor(); // API
            transaccionCoinProfe(data);
            await saveTransaccionCoinProfe(data);
          }
        }
      } else {
        // if (forceRefresh) {
        //   const data = await getAlarcoinsAlumno(); // API
        //   alarcoinAlumno(data);
        //   await saveTransaccionCoinAlumno(data);
        // } else {
        //   const local = await getTransaccionCoinAlumno();
        //   if (local) {
        //     alarcoinAlumno(local);
        //   } else {
        //     const data = await getAlarcoinsAlumno(); // API
        //     alarcoinAlumno(data);
        //     await saveTransaccionCoinAlumno(data);
        //   }
        // }
      }
    } catch (e) {
      console.error("Error cargando alarcoins:", e);
      setAlarcoinsError(true);
    } finally {
      setIsLoading(false);
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

      const aulasData: MateriasAlumnosType[] = await getalumnosAulas(
        tokenParam
      );
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
          tipo: aula.tipo,
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
        transaccioncoins,
        loadAlarcoins,
        alarcoinsError,
        epetCoin,
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
