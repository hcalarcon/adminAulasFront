import { TareaBase, tareaNueva } from "../types/TareaType";
import { DateFormatIsoLat } from "../utils/DateFormat";
import { getFromStorage } from "../utils/storage";
import { urlBase } from "../utils/url";
import { authFetch } from "./authRefresh";

export async function GetTareasAula(aula_id: number): Promise<TareaBase[]> {
  const response = await authFetch(`${urlBase}/tareas/aula/${aula_id}`, {});

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener tareas del aula");
  }

  return await response.json();
}

export async function GetTareas(): Promise<TareaBase[]> {
  const response = await authFetch(`${urlBase}/tareas/me`, {});

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener tareas del usuario");
  }

  const data = await response.json();

  const tareasConFechaFormateada = data.map((t: TareaBase) => ({
    ...t,
    fecha_limite: t.fecha_limite ? DateFormatIsoLat(t.fecha_limite) : null,
  }));

  return tareasConFechaFormateada;
}

export async function CrearTarea(tarea: tareaNueva): Promise<tareaNueva> {
  try {
    const response = await authFetch(`${urlBase}/tareas`, {
      method: "POST",

      body: JSON.stringify({
        ...tarea,
        asignados: undefined, // no se envía esto al backend
      }),
    });
    if (!response.ok) throw new Error("Error al crear tarea");
    return await response.json();
  } catch (error) {
    console.log("error al guardar tarea", error);
    throw error;
  }
}

export const eliminarTarea = async (id: number) => {
  const res = await authFetch(`${urlBase}/tareas/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar la tarea");
};

export const actualizarTarea = async (tarea: tareaNueva & { id: number }) => {
  const res = await authFetch(`${urlBase}/tareas/${tarea.id}`, {
    method: "PUT", // o PATCH si lo usás

    body: JSON.stringify(tarea),
  });

  if (!res.ok) throw new Error("Error al actualizar tarea");
  return await res.json();
};

export async function EditarTarea(
  tarea_id: number,
  tarea: Partial<tareaNueva>
): Promise<void> {
  try {
    const response = await authFetch(`${urlBase}/tareas/${tarea_id}`, {
      method: "PUT",

      body: JSON.stringify(tarea),
    });

    if (!response.ok) throw new Error("Error al actualizar tarea");
  } catch (error) {
    console.log("Error al actualizar tarea:", error);
    throw error;
  }
}
