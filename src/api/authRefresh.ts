import { getFromStorage, saveToStorage } from "../utils/storage";
import { urlBase } from "../utils/url";

export const authFetch = async (
  input: RequestInfo,
  options: RequestInit = {}
): Promise<Response> => {
  let token = await getFromStorage("token");
  const headers = options.headers || {};

  const newHeaders = new Headers(headers);
  newHeaders.set("Authorization", `Bearer ${token}`);

  let response = await fetch(input, {
    ...options,
    headers: newHeaders,
  });

  if (response.status === 401) {
    const refresh_token = await getFromStorage("refresh_token");

    if (!refresh_token) throw new Error("No hay refresh token");
    const refreshRes = await fetch(`${urlBase}/users/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }),
    });

    if (!refreshRes.ok) {
      throw new Error("No se pudo refrescar el token");
    }

    const data = await refreshRes.json();
    saveToStorage("access_token", data.access_token);

    // Reintentar con nuevo token
    const retryHeaders = new Headers(headers);
    retryHeaders.set("Authorization", `Bearer ${data.access_token}`);

    response = await fetch(input, {
      ...options,
      headers: retryHeaders,
    });
  }

  return response;
};
