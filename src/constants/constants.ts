import { Incidencia } from 'Interfaces/Incidencias';
import { Ventana } from 'Interfaces/ventana';

export const ADD_ITEM_FORM = [
  {
    id: 1,
    name: 'descripcion',
    label: 'Descripcion',
    type: 'textarea',
    required: true,
  },
  {
    id: 2,
    name: 'solicitante',
    label: 'Solicitante',
    type: 'textarea',
  },
  {
    id: 3,
    name: 'estado',
    label: 'Estado',
    type: 'textarea',
  },
  {
    id: 4,
    name: 'fechaImplementacion',
    label: 'Fecha de Implementacion',
    type: 'textarea',
  },
  {
    id: 6,
    name: 'crq',
    label: 'CRQ',
    type: 'textarea',
  },

  {
    id: 7,
    name: 'pruebasPost',
    label: 'Pruebas Post',
    type: 'textarea',
  },
  {
    id: 8,
    name: 'afectaIdp',
    label: 'Afecta Idp',
    type: 'textarea',
  },
  {
    id: 9,
    name: 'impactoNotificacion',
    label: 'Impacto/Notificacion',
    type: 'textarea',
  },
];

export const ADD_ITEM_INCIDENCIA = [
  {
    id: 1,
    name: 'incidenciaNumber',
    label: 'N° de Incidencia',
    type: 'textarea',
  },
  {
    id: 2,
    name: 'descripcion',
    label: 'Descripcion',
    type: 'textarea',
    required: true,
  },
  {
    id: 3,
    name: 'criticidad',
    label: 'criticidad',
    type: 'textarea',
  },
  {
    id: 4,
    name: 'fechaModificacion',
    label: 'fechaModificacion',
    type: 'textarea',
  },
  {
    id: 5,
    name: 'asignado',
    label: 'asignado',
    type: 'textarea',
  },
  {
    id: 6,
    name: 'estado',
    label: 'estado',
    type: 'textarea',
  },
  {
    id: 7,
    name: 'observaciones',
    label: 'observaciones',
    type: 'textarea',
  },
];

export const VentanaTable = [
  { id: 'descripcion', label: 'Descripcion', width: '15%' },
  { id: 'solicitante', label: 'Solicitante', width: '9.444%' },
  { id: 'estado', label: 'Estado', width: '9.444%' },
  {
    id: 'fechaImplementacion',
    label: 'Fecha de Implementación',
    width: '9.444%',
  },
  { id: 'crq', label: 'CRQ', width: '9.444%' },
  { id: 'ejecutaTarea', label: 'Ejecuta Tarea', width: '9.444%' },
  { id: 'controla', label: 'Controla', width: '9.444%' },
  { id: 'pruebasPost', label: 'Pruebas Post', width: '9.444%' },
  {
    id: 'impactoNotificacion',
    label: 'Impacto Notificación/ Afecta Idp',
    width: '9.444%',
  },
  { id: 'acciones', label: '', width: '9.444%' },
];

export const IncidenciaTable = [
  { id: 'descripcion', label: 'Descripción', width: '20%' },
  { id: 'incidenciaNumber', label: 'N° de incidencia', width: '13.33%' },
  { id: 'criticidad', label: 'Criticidad', width: '13.33%' },
  { id: 'estado', label: 'Estado', width: '13.33%' },
  { id: 'fechaModificacion', label: 'Fecha de Modificación', width: '13.33%' },
  { id: 'asignado', label: 'Asignado', width: '13.33%' },
  { id: 'acciones', label: '', width: '13.33%' },
];

export const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const getIncidenciaCells = (incidencia: Incidencia) => [
  {
    id: 'descripcion',
    label: 'Descripción',
    value: incidencia.descripcion,
    width: '20%',
  },
  {
    id: 'incidenciaNumber',
    label: 'Número',
    value: incidencia.incidenciaNumber,
    width: '13.33%',
  },
  {
    id: 'criticidad',
    label: 'Criticidad',
    value: incidencia.criticidad,
    width: '13.33%',
  },
  { id: 'estado', label: 'Estado', value: incidencia.estado, width: '13.33%' },
  {
    id: 'fechaModificacion',
    label: 'Fecha Modificación',
    value: incidencia.fechaModificacion,
    width: '13.33%',
  },
  {
    id: 'asignado',
    label: 'Asignado',
    value: incidencia.asignado,
    width: '13.33%',
  },
];

export const getVentanaCells = (ventana: Ventana) => [
  {
    id: 'descripcion',
    label: 'descripcion',
    content: ventana.descripcion,
    width: '15%',
  },
  {
    id: 'solicitante',
    label: 'solicitante',
    content: ventana.solicitante,
    width: '9.444%',
  },
  { id: 'estado', label: 'Estado', content: ventana.estado, width: '9.444%%' },
  {
    id: 'fechaImplementacion',
    label: 'fechaImplementacion',
    content: ventana.fechaImplementacion,
    width: '9.444%',
  },
  { id: 'crq', label: 'crq', content: ventana.crq, width: '9.444%' },
  {
    id: 'ejecutaTarea',
    label: 'ejecutaTarea',
    content: ventana.ejecutaTarea,
    width: '9.444%',
  },
  {
    id: 'controla',
    label: 'controla',
    content: ventana.controla,
    width: '9.444%',
  },
  {
    id: 'pruebasPost',
    label: 'pruebasPost',
    content: ventana.pruebasPost,
    width: '9.444%',
  },
  {
    id: 'impactoNotificacion/afectaIdp',
    label: 'impactoNotificacion/afectaIdp',
    content: `${ventana.impactoNotificacion}/${ventana.afectaIdp}`,
    width: '9.444%',
  },
];
