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

interface InformesVentanaContextProps {
  cambiosVentana: any[];
  ventanaDetallada: any[];
  cambiosCommentVentana: any[];
  obtenerCambiosVentanaPorFecha: (
    fechaInicio: Date,
    fechaFin: Date
  ) => Promise<void>;
  obtenerCambiosCommentsVentanaPorFecha: (
    fechaInicio: Date,
    fechaFin: Date
  ) => Promise<void>;
  obtenerDetalleCambioVentana: (idsVentanas: string[]) => Promise<void>;
  obtenerDetalleCommentVentana: (
    idsComentariosVentanas: string[]
  ) => Promise<void>;
  idsVentanas: string[];
  detallesCargados: boolean;
  idsComentariosVentanas: string[];
  setDetallesCargados: (cargado: boolean) => void;
  warning: boolean;
  setVentanaDetallada: (cargado: boolean) => void;
  limpiarCambiosCommentVentana: () => void;
}

const InformesVentanaContext = createContext<
  InformesVentanaContextProps | undefined
>(undefined);

export const useInformesVentanaContext = () => {
  const context = useContext(InformesVentanaContext);
  if (!context) {
    throw new Error(
      'useInformesVentanaContext debe ser usado dentro de un InformesVentanaProvider'
    );
  }
  return context;
};

export default function InformesVentanaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cambiosVentana, setCambiosVentana] = useState<any[]>([]);
  const [cambiosCommentVentana, setCambiosCommentVentana] = useState<any[]>([]);
  const [idsVentanas, setIdsVentanas] = useState<string[]>([]);
  const [idsComentariosVentanas, setIdsComentariosVentanas] = useState<
    string[]
  >([]);
  const [ventanaDetallada, setVentanaDetallada] = useState<any[]>([]);
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

  const obtenerCambiosVentanaPorFecha = async (
    fechaInicio: Date,
    fechaFin: Date
  ) => {
    try {
      const startDate =
        typeof fechaInicio === 'string' ? new Date(fechaInicio) : fechaInicio;
      const endDate =
        typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin;

      if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error('Las fechas deben ser instancias de Date');
      }
      setCambiosVentana([]);
      const formattedStartDate = formatDate(fechaInicio);
      const formattedEndDate = formatDate(fechaFin);
      const response = await clienteAxios.get(
        `/cambios/ventana/fecha/${formattedStartDate}/${formattedEndDate}`
      );
      const { idsCambiosVentanas } = response.data;
      setIdsVentanas(idsCambiosVentanas);
    } catch (error) {
      console.error('Error al obtener cambios de ventana por fechas:', error);
    }
  };

  const obtenerCambiosCommentsVentanaPorFecha = async (
    fechaInicio: Date,
    fechaFin: Date
  ) => {
    try {
      const startDate =
        fechaInicio instanceof Date ? fechaInicio : new Date(fechaInicio);
      const endDate = fechaFin instanceof Date ? fechaFin : new Date(fechaFin);

      if (!startDate.getTime() || !endDate.getTime()) {
        throw new Error('Las fechas deben ser instancias de Date válidas');
      }

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      const response = await clienteAxios.get(
        `/cambios/commentsventana/fecha/${formattedStartDate}/${formattedEndDate}`
      );
      const { idsCambiosCommetsVentanas } = response.data;

      setIdsComentariosVentanas(idsCambiosCommetsVentanas);
    } catch (error) {
      console.error(
        'Error al obtener comentarios de ventana por fechas:',
        error
      );
    }
  };

  const obtenerDetalleCambioVentana = async (idsVentanas: string[]) => {
    try {
      const nuevosCambios: any[] = [];
      for (const id of idsVentanas) {
        const response = await clienteAxios.get(`/cambios/ventana/${id}`);
        nuevosCambios.push(response.data.cambioVentana);
      }
      setCambiosVentana((prevCambiosVentana) => [
        ...prevCambiosVentana,
        ...nuevosCambios,
      ]);
    } catch (error) {
      console.error('Error al obtener detalle de cambio de ventana:', error);
    }
  };

  const obtenerDetalleCommentVentana = async (
    idsComentariosVentanas: string[]
  ) => {
    try {
      const nuevosCambiosComment: any[] = [];
      for (const id of idsComentariosVentanas) {
        const response = await clienteAxios.get(
          `/cambios/commentsventana/${id}`
        );
        nuevosCambiosComment.push(response.data.commentVentana);
      }
      setCambiosCommentVentana((prevCambiosCommentVentana) => [
        ...prevCambiosCommentVentana,
        ...nuevosCambiosComment,
      ]);
    } catch (error) {
      console.error(
        'Error al obtener detalle de comentario de ventana:',
        error
      );
    }
  };

  const obtenerDetallesVentana = async () => {
    try {
      const ventanasUnicas = new Set(
        cambiosCommentVentana.map(
          (cambio) => `${cambio.semana}-${cambio.ventana}`
        )
      );
      const nuevasVentanasDetalladas: any[] = [];
      for (const ventana of ventanasUnicas) {
        const [semana, ventanaId] = ventana.split('-');
        const responseElemento = await clienteAxios.get(
          `/ventanas/${semana}/${ventanaId}`
        );
        nuevasVentanasDetalladas.push(responseElemento.data);
      }
      setVentanaDetallada(nuevasVentanasDetalladas);
      setDetallesCargados(true);
    } catch (error) {
      console.error('Error al obtener detalles de las ventanas:', error);
    }
  };

  useEffect(() => {
    if (detallesCargados && ventanaDetallada.length === 0) {
      const timeoutId = setTimeout(() => {
        setWarning(true);
      }, 6000);
      return () => clearTimeout(timeoutId);
    }
    setWarning(false);
  }, [ventanaDetallada, detallesCargados]);

  useEffect(() => {
    if (cambiosCommentVentana.length > 0) {
      obtenerDetallesVentana();
    }
  }, [cambiosCommentVentana]);

  const limpiarCambiosCommentVentana = () => {
    setCambiosCommentVentana([]);
  };

  const contextValue: InformesVentanaContextProps = {
    cambiosVentana,
    ventanaDetallada,
    cambiosCommentVentana,
    obtenerCambiosVentanaPorFecha,
    obtenerCambiosCommentsVentanaPorFecha,
    obtenerDetalleCommentVentana,
    obtenerDetalleCambioVentana,
    idsVentanas,
    detallesCargados,
    idsComentariosVentanas,
    setDetallesCargados,
    warning,
    setVentanaDetallada,
    limpiarCambiosCommentVentana,
  };

  return (
    <InformesVentanaContext.Provider value={contextValue}>
      {children}
    </InformesVentanaContext.Provider>
  );
}
