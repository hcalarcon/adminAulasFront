export interface TareaBase {
  titulo: string;
  descripcion?: string | null;
  tipo?: string | null;
  fecha_creacion: string; // ISO format: YYYY-MM-DD
  fecha_limite?: string | null; // ISO format
  aula_id: number;
  created_by: number;
  alumno_id?: number | null; // si es tarea individual
  id?: number;
  cantidad_alumnos?: number;
  entregados?: number;
  fecha_limite_formateada?: string;
}

export interface tareaNueva extends TareaBase {
  asignados: number[];
}

export interface TareaUpdate {
  titulo?: string;
  descripcion?: string;
  tipo?: string;
  fecha_limite?: string;
  alumno_id?: number;
}
