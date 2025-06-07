import { urlBase } from "../utils/url";
import { MateriasAlumnosType, MateriasType } from "../types/AulaType";

export async function getalumnosAulas(
  token: string | null
): Promise<MateriasAlumnosType[]> {
  const response = await fetch(`${urlBase}/aulas/mis-aulas-con-alumnos`, {
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

export async function getMisAulas(token: string): Promise<MateriasType[]> {
  const response = await fetch(`${urlBase}/aulas/mis-aulas`, {
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
