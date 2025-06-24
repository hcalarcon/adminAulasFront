export interface TransaccionCoinType {
  id: number;
  alumno_id: number;
  aula_id: number;
  detalle: string;
  fecha: Date;
  suma: number;
}

export interface TransaccionCoinCreateType
  extends Omit<TransaccionCoinType, "id" | "fecha"> {
  cantidad: number;
  moneda_id: number | undefined;
}

export interface TransaccionCoinHistorialType {
  cantidad: number;
  detalle: string;
  fecha: Date;
  suma: boolean;
  id: number;
}

export interface TransaccionCoinAlumnoType {
  aula_id: number;
  nombre_moneda: string;
  epetcoins: TransaccionCoinHistorialType[];
}

export interface TransaccionCoinAulaAlumnoType
  extends TransaccionCoinAlumnoType {
  nombre: string;
}

export interface TransaccionCoinHistorialAulaType {
  aula_id: number;
  nombre: string;
  alumnos: TransaccionCoinAlumnoType[];
}

export interface Epetcoin {
  id: number;
  nombre: string;
  profesor_id: number;
  coin?: boolean;
}
