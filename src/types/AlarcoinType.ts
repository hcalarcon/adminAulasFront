import Alarcoin from "../screens/alarcoin";

export interface Alarcoin {
  id: number;
  alumno_id: number;
  aula_id: number;
  detalle: string;
  fecha: Date;
  suma: number;
}

export interface AlarcoinCreateType extends Omit<Alarcoin, "id" | "fecha"> {
  cantidad: number;
}

export interface AlarcoinHistorialType {
  cantidad: number;
  detalle: string;
  fecha: Date;
  suma: number;
  id: number;
}

export interface AlarcoinAlumnoType {
  id: number;
  alarcoins: AlarcoinHistorialType[];
}

export interface AlarcoinAulaAlumnoType extends AlarcoinAlumnoType {
  nombre: string;
}

export interface AlarcoinHistorialAulaType {
  id: number;
  nombre: string;
  alumnos: AlarcoinAlumnoType[];
}
