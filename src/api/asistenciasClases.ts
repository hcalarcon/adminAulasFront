import { AsistenciaAlumnoType, AsistenciaType } from "../types/AsistenciaType";
import { urlBase } from "../utils/url";

export async function AsistenciasClase(
  clase_id: number,
  token: string | null
): Promise<AsistenciaType[]> {
  const response = await fetch(
    `${urlBase}/asistencias/asistencias-por-clase/${clase_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}

export async function getAsistenciasPorClase(
  token: string | null
): Promise<AsistenciaAlumnoType[]> {
  const response = await fetch(`${urlBase}/asistencias/mis-asistencias`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}
