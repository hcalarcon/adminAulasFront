import React, { useEffect } from "react";
import { Layout } from "../../layout/layout";
import { useAuth } from "../../context/authContent";
import TareaAlumno from "./TareaAlumno";
import TareaProfe from "./TareaProfe";
import { useAppData } from "../../context/appDataContext";

const Tareas = () => {
  const { user } = useAuth();
  const { loadTareas } = useAppData();

  useEffect(() => {
    loadTareas(true);
  }, []);

  return <Layout>{user?.is_teacher ? <TareaProfe /> : <TareaAlumno />}</Layout>;
};

export default Tareas;
