import { urlBase } from "../utils/url";
import { MateriasAlumnosType, MateriasType } from "../types/AulaType";
import { authFetch } from "./authRefresh";

export async function getalumnosAulas(): Promise<MateriasAlumnosType[]> {
  const response = await authFetch(`${urlBase}/aulas/mis-aulas-con-alumnos`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}

export async function getMisAulas(): Promise<MateriasType[]> {
  const response = await authFetch(`${urlBase}/aulas/mis-aulas`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}
