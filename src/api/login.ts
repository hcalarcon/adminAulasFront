import { User } from "../types/UserType";
import { urlBase } from "../utils/url";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(`${urlBase}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await response.json();
}
