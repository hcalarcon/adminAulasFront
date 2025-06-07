import { User } from "./UserType";

export interface MateriasType {
  id: number;
  nombre: string;
  profesor_id: number;
  ano: number;
  division: number;
  especialidad: string;
  cantidad_clases: number;
}

export interface ClaseType {
  id: number;
  tema: string;
  fecha: Date;
  aula_id: number;
  aula_nombre: string;
}

export interface MateriasAlumnosType {
  id: number;
  nombre: string;
  profesor_id: number;
  ano: number;
  division: number;
  especialidad: string;
  cantidad_clases: number;
  alumnos: User[];
}

export interface MateriasSimpleType extends MateriasType {
  alumnoIds: number[];
}
