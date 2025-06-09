import {
  Alarcoin,
  AlarcoinAulaAlumnoType,
  AlarcoinCreateType,
} from "../types/AlarcoinType";
import { MateriasAlumnosType } from "../types/AulaType";
import { urlBase } from "../utils/url";

// Crear alarcoin
export async function crearAlarcoin(
  token: string | null,
  data: AlarcoinCreateType
): Promise<Alarcoin> {
  const response = await fetch(`${urlBase}/alarcoins/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al asignar alarcoin");
  }

  return await response.json();
}

// Actualizar alarcoin
export async function actualizarAlarcoin(
  token: string,
  id: number,
  data: {
    aula_id: number;
    alumno_id: number;
    detalle: string;
    suma: boolean;
  }
): Promise<Alarcoin> {
  const response = await fetch(`${urlBase}/alarcoins/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al actualizar alarcoin");
  }

  return await response.json();
}

// Obtener alarcoins del alumno actual
export async function getAlarcoinsAlumno(
  token: string | null
): Promise<AlarcoinAulaAlumnoType[]> {
  const response = await fetch(`${urlBase}/alarcoins/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener mis alarcoins");
  }

  return await response.json();
}

// Obtener historial del profesor
export async function getHistorialProfesor(
  token: string | null
): Promise<MateriasAlumnosType[]> {
  const response = await fetch(`${urlBase}/alarcoins/historial`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener historial");
  }

  return await response.json();
}
