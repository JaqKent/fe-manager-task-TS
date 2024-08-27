/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import clienteAxios from '../../config/axios';

interface InformesIncidenciaContextProps {
  cambiosIncidencia: any[];
  incidenciaDetallada: any[];
  cambiosCommentIncidencia: any[];
  obtenerCambiosIncidenciaPorFecha: (
    fechaInicio: Date,
    fechaFin: Date
  ) => Promise<void>;
  obtenerCambiosCommentsIncidenciaPorFecha: (
    fechaInicio: Date,
    fechaFin: Date
  ) => Promise<void>;
  obtenerDetalleCambioIncidenica: (idsIncidencias: string[]) => Promise<void>;
  obtenerDetalleCommentIncidencia: (
    idsComentariosIncidencias: string[]
  ) => Promise<void>;
  idsIncidencias: string[];
  detallesCargados: boolean;
  idsComentariosIncidencias: string[];
  setDetallesCargados: (cargado: boolean) => void;
  warning: boolean;
  setIncidenciaDetallada: (cargado: boolean) => void;
}

const InformesIncidenciaContext = createContext<
  InformesIncidenciaContextProps | undefined
>(undefined);

export const useInformesIncidenciaContext = () => {
  const context = useContext(InformesIncidenciaContext);
  if (!context) {
    throw new Error(
      'useInformesIncidenciaContext debe ser usado dentro de un InformesIncidenciaProvider'
    );
  }
  return context;
};

export default function InformesIncidenciaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cambiosIncidencia, setCambiosIncidencia] = useState<any[]>([]);
  const [cambiosCommentIncidencia, setCambiosCommentIncidencia] = useState<
    any[]
  >([]);
  const [idsIncidencias, setIdsIncidencias] = useState<string[]>([]);
  const [idsComentariosIncidencias, setIdsComentariosIncidencias] = useState<
    string[]
  >([]);
  const [incidenciaDetallada, setIncidenciaDetallada] = useState<any[]>([]);
  const [detallesCargados, setDetallesCargados] = useState(false);
  const [warning, setWarning] = useState(false);

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      console.error('Expected a valid Date object but received:', date);
      return '';
    }
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const obtenerCambiosIncidenciaPorFecha = async (
    fechaInicio: Date | string,
    fechaFin: Date | string
  ) => {
    try {
      const startDate =
        typeof fechaInicio === 'string' ? new Date(fechaInicio) : fechaInicio;
      const endDate =
        typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin;

      if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error('Las fechas deben ser instancias de Date');
      }

      setCambiosIncidencia([]);
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const response = await clienteAxios.get(
        `/cambios/incidencia/fecha/${formattedStartDate}/${formattedEndDate}`
      );
      const { idsCambiosIncidencias } = response.data;
      console.log('IDs de cambios de incidencia:', idsCambiosIncidencias);
      setIdsIncidencias(idsCambiosIncidencias);
    } catch (error) {
      console.error(
        'Error al obtener cambios de incidencias por fechas:',
        error
      );
    }
  };

  const obtenerCambiosCommentsIncidenciaPorFecha = async (
    fechaInicio: Date,
    fechaFin: Date
  ) => {
    try {
      setCambiosCommentIncidencia([]);
      const response = await clienteAxios.get(
        `/cambios/commentsincidencia/fecha/${formatDate(fechaInicio)}/${formatDate(fechaFin)}`
      );
      const { idsCambiosCommetsIncidencias } = response.data;
      console.log(
        'IDs de cambios de comentarios de incidencia:',
        idsCambiosCommetsIncidencias
      );
      setIdsComentariosIncidencias(idsCambiosCommetsIncidencias);
    } catch (error) {
      console.error(
        'Error al obtener comentarios de Incidencia por fechas:',
        error
      );
    }
  };

  const obtenerDetalleCambioIncidenica = async (idsIncidencias: string[]) => {
    try {
      const nuevosCambios: any[] = [];
      for (const id of idsIncidencias) {
        const response = await clienteAxios.get(`/cambios/incidencia/${id}`);
        nuevosCambios.push(response.data.cambioIncidencia);
      }
      setCambiosIncidencia((prevCambiosIncidencia) => [
        ...prevCambiosIncidencia,
        ...nuevosCambios,
      ]);
    } catch (error) {
      console.error('Error al obtener detalle de cambio de Incidencia:', error);
    }
  };

  const obtenerDetalleCommentIncidencia = async (
    idsComentariosIncidencias: string[]
  ) => {
    try {
      const nuevosCambiosComment: any[] = [];
      for (const id of idsComentariosIncidencias) {
        const response = await clienteAxios.get(
          `/cambios/commentsincidencia/${id}`
        );
        nuevosCambiosComment.push(response.data.commentIncidencia);
      }
      setCambiosCommentIncidencia((prevCambiosCommentIncidencia) => [
        ...prevCambiosCommentIncidencia,
        ...nuevosCambiosComment,
      ]);
    } catch (error) {
      console.error(
        'Error al obtener detalle de comentario de Incidencia:',
        error
      );
    }
  };

  const obtenerDetallesIncidencia = async () => {
    try {
      const incidenciasUnicas = new Set(
        cambiosCommentIncidencia.map((cambio) => cambio.incidencias)
      );
      const nuevasIncidenciasDetalladas: any[] = [];
      for (const incidenciaId of incidenciasUnicas) {
        const responseElemento = await clienteAxios.get(
          `/incidencias/${incidenciaId}`
        );
        nuevasIncidenciasDetalladas.push(responseElemento.data);
      }
      console.log(
        'incidencias detalladas para mapear',
        nuevasIncidenciasDetalladas
      );
      setIncidenciaDetallada(nuevasIncidenciasDetalladas);
      setDetallesCargados(true);
    } catch (error) {
      console.error('Error al obtener detalles de las Incidencias:', error);
    }
  };

  useEffect(() => {
    if (cambiosCommentIncidencia.length > 0) {
      obtenerDetallesIncidencia();
    }
  }, [cambiosCommentIncidencia]);

  useEffect(() => {
    if (detallesCargados && incidenciaDetallada.length === 0) {
      const timeoutId = setTimeout(() => {
        setWarning(true);
      }, 6000);
      return () => clearTimeout(timeoutId);
    }
    setWarning(false);
  }, [incidenciaDetallada, detallesCargados]);

  const contextValue: InformesIncidenciaContextProps = {
    cambiosIncidencia,
    incidenciaDetallada,
    cambiosCommentIncidencia,
    obtenerCambiosIncidenciaPorFecha,
    obtenerCambiosCommentsIncidenciaPorFecha,
    obtenerDetalleCommentIncidencia,
    obtenerDetalleCambioIncidenica,
    idsIncidencias,
    detallesCargados,
    idsComentariosIncidencias,
    setDetallesCargados,
    warning,
    setIncidenciaDetallada,
  };

  return (
    <InformesIncidenciaContext.Provider value={contextValue}>
      {children}
    </InformesIncidenciaContext.Provider>
  );
}
