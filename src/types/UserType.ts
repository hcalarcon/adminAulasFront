export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  is_teacher: boolean;
  cambiarContrasena: boolean;
  alarcoin?: number;
}
