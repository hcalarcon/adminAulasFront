import { urlBase } from "../utils/url";
import { MateriasType } from "../types/AulaType";

export async function misMaterias(token: string | null): Promise<MateriasType> {
  const response = await fetch(`${urlBase}/aulas/mis-aulas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}
