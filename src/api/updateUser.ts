// services/userService.ts
import { User, UserUpdateType } from "../types/UserType";
import { getFromStorage } from "../utils/storage";
import { urlBase } from "../utils/url";

export async function updateUser(data: UserUpdateType): Promise<User> {
  const token = await getFromStorage("token");
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
