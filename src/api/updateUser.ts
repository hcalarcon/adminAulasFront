// services/userService.ts
import { User, UserUpdateType } from "../types/UserType";
import { urlBase } from "../utils/url";
import { authFetch } from "./authRefresh";

export async function updateUser(data: UserUpdateType): Promise<User> {
  const response = await authFetch(`${urlBase}/users/me`, {
    method: "PUT",

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al actualizar el usuario");
  }

  return await response.json();
}
