import {
  Epetcoin,
  TransaccionCoinCreateType,
  TransaccionCoinHistorialAulaType,
  TransaccionCoinType,
} from "../types/EpetcoinType";
import { urlBase } from "../utils/url";
import { getFromStorage } from "../utils/storage";

// Crear alarcoin
// export async function crearAlarcoin(
//   token: string | null,
//   data: AlarcoinCreateType
// ): Promise<Alarcoin> {
//   const response = await fetch(`${urlBase}/alarcoins/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || "Error al asignar alarcoin");
//   }

//   return await response.json();
// }

// // Actualizar alarcoin
// export async function actualizarAlarcoin(
//   token: string,
//   id: number,
//   data: {
//     aula_id: number;
//     alumno_id: number;
//     detalle: string;
//     suma: boolean;
//   }
// ): Promise<Alarcoin> {
//   const response = await fetch(`${urlBase}/alarcoins/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || "Error al actualizar alarcoin");
//   }

//   return await response.json();
// }

// // Obtener alarcoins del alumno actual
// export async function getAlarcoinsAlumno(
//   token: string | null
// ): Promise<AlarcoinAulaAlumnoType[]> {
//   const response = await fetch(`${urlBase}/alarcoins/me`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || "Error al obtener mis alarcoins");
//   }

//   return await response.json();
// }

// Obtener historial del profesor
// export async function getHistorialProfesor(
//   token: string | null
// ): Promise<MateriasAlumnosType[]> {
//   const response = await fetch(`${urlBase}/alarcoins/historial`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || "Error al obtener historial");
//   }

//   return await response.json();
// }

//obtener epetcoin - nueva

export async function getEpetcoin(): Promise<Epetcoin | undefined> {
  try {
    const token = await getFromStorage("token");
    const response = await fetch(`${urlBase}/epetcoins/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error al consultar /me", error);
    return undefined;
  }
}

//obtener epetcoin - nueva
export async function crearEpetcoin(
  nombre: string
): Promise<Epetcoin | undefined> {
  try {
    const token = await getFromStorage("token");
    const response = await fetch(`${urlBase}/epetcoins/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error al consultar /me", error);
    return undefined;
  }
}

export async function getHistorialProfesor(): Promise<
  TransaccionCoinHistorialAulaType[]
> {
  const token = await getFromStorage("token");
  const response = await fetch(`${urlBase}/epetcoins/historial`, {
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

export async function crearTransaccion(
  data: TransaccionCoinCreateType
): Promise<TransaccionCoinType> {
  const token = await getFromStorage("token");
  const response = await fetch(`${urlBase}/epetcoins/transaccion`, {
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

export async function getHistorialAlumno(): Promise<
  TransaccionCoinHistorialAulaType[]
> {
  const token = await getFromStorage("token");
  const response = await fetch(`${urlBase}/epetcoins/historial`, {
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
