export interface Incidencia {
  _id?: string;
  descripcion?: string;
  incidenciaNumber?: string;
  criticidad?: string;
  estado?: string;
  fechaModificacion?: string;
  asignado?: string;
  observaciones?: string;
  year?: string;
  month?: string;
  enBacklog?: boolean;
}

export interface Field {
  name?: string;
  label?: string;
  type?: any;
  required?: boolean;
}

export interface IncidenciaData {
  label: string;
  value: string | number | undefined;
  width: string;
}
