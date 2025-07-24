import { AsistenciaAlumnoType, AsistenciaType } from "../types/AsistenciaType";
import { urlBase } from "../utils/url";
import { authFetch } from "./authRefresh";

export async function AsistenciasClase(
  clase_id: number
): Promise<AsistenciaType[]> {
  const response = await authFetch(
    `${urlBase}/asistencias/asistencias-por-clase/${clase_id}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}

export async function getAsistenciasPorClase(): Promise<
  AsistenciaAlumnoType[]
> {
  const response = await authFetch(`${urlBase}/asistencias/mis-asistencias`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener asistencias");
  }

  return await response.json();
}
