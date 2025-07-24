export type MisNotas = {
  aulaId: number;
  notas: NotaType[];
};

export interface NotaType {
  tarea_id: number;
  alumno_id: number;
  nota: number;
  fecha_entrega: string;
  entregado: boolean;
  id: number;
}

export type NotaTareaUpdate = {
  alumno_id: number;
  nota?: string;
  entregado?: boolean;
};

export type NotaTareaUpdateMasiva = {
  tarea_id: number;
  notas: NotaTareaUpdate[];
};
