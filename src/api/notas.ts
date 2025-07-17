import { NotaTareaUpdateMasiva } from "../types/NotaType";
import { getFromStorage } from "../utils/storage";
import { urlBase } from "../utils/url";

export const asignarTareaMasiva = async (
  tarea_id: number,
  alumnoIds: number[]
) => {
  const token = await getFromStorage("token");
  const res = await fetch(`${urlBase}/notas/asignar-masiva`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const token = await getFromStorage("token");
  try {
    const response = await fetch(`${urlBase}/notas/tarea/${tarea_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.log("Error al obtener notas");
  }
};

export const getNotasMe = async () => {
  const token = await getFromStorage("token");
  try {
    const response = await fetch(`${urlBase}/notas/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  const token = await getFromStorage("token");
  const response = await fetch(`${urlBase}/notas/notas-tareas/eliminar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tarea_id, alumno_ids: alumnoIds }),
  });
  if (!response.ok) throw new Error("Error eliminando notas");
  return response.json();
}

export async function actualizarNotasMasivas(
  data: NotaTareaUpdateMasiva
): Promise<void> {
  const token = await getFromStorage("token");

  const response = await fetch(`${urlBase}/notas/tareas/notas/masiva`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar las notas");
  }
}
