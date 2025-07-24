import { urlBase } from "../utils/url";
import { MateriasType } from "../types/AulaType";
import { authFetch } from "./authRefresh";

export async function misMaterias(): Promise<MateriasType> {
  const response = await authFetch(`${urlBase}/aulas/mis-aulas`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}
