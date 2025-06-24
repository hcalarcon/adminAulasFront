export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  is_teacher: boolean;
  cambiarContrasena: boolean;
  grupo_id: number;
  epetcoin?: number;
}

export interface UserUpdateType {
  nombre?: string;
  apellido?: string;
  email?: string;
  newPassword?: string;
  cambiarContrasena?: boolean;
  confirmPassword?: string;
  password?: string;
}
