import { NotaTareaUpdateMasiva } from "../types/NotaType";
import { urlBase } from "../utils/url";
import { authFetch } from "./authRefresh";

export const asignarTareaMasiva = async (
  tarea_id: number,
  alumnoIds: number[]
) => {
  const res = await authFetch(`${urlBase}/notas/asignar-masiva`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tarea_id,
      alumnos: alumnoIds,
    }),
  });

  if (!res.ok) throw new Error("Error al asignar tarea a alumnos");
  return await res.json();
};

export const getNotas = async (tarea_id: number) => {
  try {
    const response = await authFetch(`${urlBase}/notas/tarea/${tarea_id}`, {
      method: "GET",
    });

    return await response.json();
  } catch (error) {
    console.log("Error al obtener notas");
  }
};

export const getNotasMe = async () => {
  try {
    const response = await authFetch(`${urlBase}/notas/me`, {
      method: "GET",
    });

    return await response.json();
  } catch (error) {
    console.log("Error al obtener notas");
  }
};

export async function eliminarNotasMasivas(
  tarea_id: number,
  alumnoIds: number[]
) {
  const response = await authFetch(`${urlBase}/notas/notas-tareas/eliminar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tarea_id, alumno_ids: alumnoIds }),
  });
  if (!response.ok) throw new Error("Error eliminando notas");
  return response.json();
}

export async function actualizarNotasMasivas(
  data: NotaTareaUpdateMasiva
): Promise<void> {
  const response = await authFetch(`${urlBase}/notas/tareas/notas/masiva`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar las notas");
  }
}
