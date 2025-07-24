import { urlBase } from "../utils/url";
import { ClaseType } from "../types/AulaType";
import { authFetch } from "./authRefresh";

export async function clasesMateria(aulaId: number): Promise<ClaseType[]> {
  const response = await authFetch(`${urlBase}/clases/aulas/${aulaId}/clases`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}
