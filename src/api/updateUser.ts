// services/userService.ts
import { User } from "../types/UserType";
import { urlBase } from "../utils/url";

export interface UpdateUserData {
  password?: string;
  name?: string;
  email?: string;
  cambiarContrasena: boolean;
}

export async function updateUser(
  data: UpdateUserData,
  token: string | null
): Promise<User> {
  const response = await fetch(`${urlBase}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al actualizar el usuario");
  }

  return await response.json();
}
