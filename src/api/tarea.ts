import { TareaBase, tareaNueva } from "../types/TareaType";
import { DateFormatIsoLat } from "../utils/DateFormat";
import { getFromStorage } from "../utils/storage";
import { urlBase } from "../utils/url";

export async function GetTareasAula(aula_id: number): Promise<TareaBase[]> {
  const token = await getFromStorage("token");
  const response = await fetch(`${urlBase}/tareas/aula/${aula_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener tareas del aula");
  }

  return await response.json();
}

export async function GetTareas(): Promise<TareaBase[]> {
  const token = await getFromStorage("token");
  const response = await fetch(`${urlBase}/tareas/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  const token = await getFromStorage("token");
  try {
    const response = await fetch(`${urlBase}/tareas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
  const token = await getFromStorage("token");
  const res = await fetch(`${urlBase}/tareas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al eliminar la tarea");
};

export const actualizarTarea = async (tarea: tareaNueva & { id: number }) => {
  const token = await getFromStorage("token");
  const res = await fetch(`${urlBase}/tareas/${tarea.id}`, {
    method: "PUT", // o PATCH si lo usás
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tarea),
  });

  if (!res.ok) throw new Error("Error al actualizar tarea");
  return await res.json();
};

export async function EditarTarea(
  tarea_id: number,
  tarea: Partial<tareaNueva>
): Promise<void> {
  const token = await getFromStorage("token");
  try {
    const response = await fetch(`${urlBase}/tareas/${tarea_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tarea),
    });

    if (!response.ok) throw new Error("Error al actualizar tarea");
  } catch (error) {
    console.log("Error al actualizar tarea:", error);
    throw error;
  }
}
