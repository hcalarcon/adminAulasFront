import {
  Epetcoin,
  TransaccionCoinAulaAlumnoType,
  TransaccionCoinCreateType,
  TransaccionCoinHistorialAulaType,
  TransaccionCoinType,
} from "../types/EpetcoinType";
import { urlBase } from "../utils/url";
import { getFromStorage } from "../utils/storage";
import { authFetch } from "./authRefresh";

export async function getEpetcoin(): Promise<Epetcoin | undefined> {
  try {
    const token = await getFromStorage("token");
    const response = await authFetch(`${urlBase}/epetcoins/me`, {});

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
    const response = await authFetch(`${urlBase}/epetcoins/`, {
      method: "POST",

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
  const response = await authFetch(`${urlBase}/epetcoins/historial`, {});

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener historial");
  }

  return await response.json();
}

export async function crearTransaccion(
  data: TransaccionCoinCreateType
): Promise<TransaccionCoinType> {
  const response = await authFetch(`${urlBase}/epetcoins/transaccion`, {
    method: "POST",

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al asignar alarcoin");
  }

  return await response.json();
}

export async function getHistorialAlumno(): Promise<
  TransaccionCoinAulaAlumnoType[]
> {
  const response = await authFetch(`${urlBase}/epetcoins/historial`, {});

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener historial");
  }

  return await response.json();
}
