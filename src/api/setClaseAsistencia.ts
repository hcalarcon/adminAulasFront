import { AsistenciaType } from "../types/AsistenciaType";
import { urlBase } from "../utils/url";

export async function setClaseAsistencia(
  clase_id: number,
  token: string | null,
  asistencias: Omit<AsistenciaType, "id">[]
): Promise<void> {
  console.log(asistencias);
  const response = await fetch(`${urlBase}/asistencias/masiva/${clase_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(asistencias),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al guardar asistencias");
  }
}
