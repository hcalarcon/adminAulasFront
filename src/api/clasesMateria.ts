import { urlBase } from "../utils/url";
import { ClaseType } from "../types/AulaType";

export async function clasesMateria(
  aulaId: number,
  token: string | null
): Promise<ClaseType[]> {
  const response = await fetch(`${urlBase}/clases/aulas/${aulaId}/clases`, {
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
