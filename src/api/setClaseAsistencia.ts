import { AsistenciaType } from "../types/AsistenciaType";
import { urlBase } from "../utils/url";
import { authFetch } from "./authRefresh";

export async function setClaseAsistencia(
  clase_id: number,

  asistencias: Omit<AsistenciaType, "id">[]
): Promise<void> {
  const response = await authFetch(
    `${urlBase}/asistencias/masiva/${clase_id}`,
    {
      method: "POST",

      body: JSON.stringify(asistencias),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al guardar asistencias");
  }
}
