// context/AulasContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { MateriasType as Aula } from "../types/AulaType"; // tus tipos
import { saveAula } from "../utils/storage";
import { useAuth } from "./authContent";
import { misMaterias } from "../api/misMaterias";

interface AulasContextType {
  aulas: Aula[];
  setAulas: (aulas: Aula[]) => void;
  isLoading: boolean;
  loadAulas: () => void;
  //   getClasesPorAula: (aulaId: number) => Clase[];
}

const AulasContext = createContext<AulasContextType | undefined>(undefined);

export const AulasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  //   const getClasesPorAula = (aulaId: number) => {
  //     const aula = aulas.find(a => a.id === aulaId);
  //     return aula?.clases || [];
  //   };

  const loadAulas = async () => {
    if (!token) return;
    try {
      const data = await misMaterias(token);
      setAulas(data);
      await saveAula(data);
    } catch (error) {
      console.error("Error al obtener materias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAulas();
  }, [token]); // se ejecuta solo cuando haya un token

  return (
    <AulasContext.Provider value={{ aulas, setAulas, isLoading, loadAulas }}>
      {children}
    </AulasContext.Provider>
  );
};

export const useAulas = () => {
  const context = useContext(AulasContext);
  if (!context)
    throw new Error("useAulas must be used within an AulasProvider");
  return context;
};
