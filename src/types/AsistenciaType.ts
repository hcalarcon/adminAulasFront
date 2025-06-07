export interface AsistenciaType {
  id: number;
  presente: number;
  alumno_id: number;
  justificado: string;
  clase_nombre?: string;
}

export interface AsistenciaAlumnoType {
  aula_id: number;
  materia: string;
  porcentaje_asistencia: number;
  asistencias: AsistenciaType[];
}
