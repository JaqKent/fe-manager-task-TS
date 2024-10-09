/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, ReactNode, useContext, useState } from 'react';
import { Ventana } from 'Interfaces/Ventana';

import clienteAxios from '../../config/axios';

interface VentanaContextProps {
  todasLasVentanas: Ventana[];
  ventanasemana: Ventana[];
  errorventana: boolean;
  semanaSeleccionada: string | null;
  ventanaseleccionada: Ventana | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  obtenerVentanasPorSemana: (semanaId: string) => Promise<void>;
  obtenerTodasLasVentanas: (ventana: Ventana) => Promise<void>;
  obtenerVentana: (semanaId: string, ventanaId: string) => Promise<void>;
  agregarVentana: (ventana: Ventana) => Promise<void>;
  eliminarVentana: (ventanaId: string) => Promise<void>;
  validarVentana: () => void;
  cambiarEstadoVentana: (ventana: Ventana) => void;
  guardarVentanaActual: (ventana: Ventana) => void;
  ventanaActual: (ventanaId: string) => void;
  actualizarVentana: (
    idSemana: string,
    idVentana: string,
    ventana: Ventana
  ) => Promise<void>;
  setSemanaSeleccionada: (semana: string) => void;
  limpiarVentana: () => void;
  limpiarVentanaSemana: () => void;
  cargarVentanaParaEdicion: (ventana: Ventana) => void;
}

const VentanaContext = createContext<VentanaContextProps | undefined>(
  undefined
);

export const useVentanaContext = () => {
  const context = useContext(VentanaContext);
  if (!context) {
    throw new Error(
      'useVentanaContext debe ser usado dentro de un VentanaProvider'
    );
  }
  return context;
};

export default function VentanaProvider({ children }: { children: ReactNode }) {
  const [todasLasVentanas, setTodasLasVentanas] = useState<Ventana[]>([]);
  const [ventanasemana, setVentanasemana] = useState<Ventana[]>([]);
  const [errorventana, setErrorVentana] = useState(false);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<string | null>(
    null
  );
  const [ventanaseleccionada, setVentanaseleccionada] =
    useState<Ventana | null>(null);
  const [loading, setLoading] = useState(false);

  const obtenerTodasLasVentanas = async () => {
    try {
      setLoading(true);
      const resultado = await clienteAxios.get('/ventanas');
      setTodasLasVentanas(resultado.data);
    } catch (error) {
      console.error('Error al obtener todas las ventanas:', error);
      setTodasLasVentanas([]);
      setErrorVentana(true);
    } finally {
      setLoading(false);
    }
  };

  const obtenerVentanasPorSemana = async (semanaId: string) => {
    try {
      const resultado = await clienteAxios.get(`/ventanas/${semanaId}`);
      setVentanasemana(resultado.data);
    } catch (error) {
      console.error('Error al obtener las ventanas:', error);
      setVentanasemana([]);
    }
  };

  const obtenerVentana = async (semanaId: string, ventanaId: string) => {
    console.log(
      `Obteniendo ventana con ID: ${ventanaId} para semana ${semanaId}`
    );
    try {
      setLoading(true);
      const resultado = await clienteAxios.get(
        `/ventanas/${semanaId}/${ventanaId}`
      );
      setVentanaseleccionada(resultado.data);
    } catch (error) {
      console.error('Error al obtener las ventanas:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarVentana = async (ventana: Ventana) => {
    try {
      setLoading(true);
      const { data } = await clienteAxios.post(
        `/ventanas/${ventana.semana}`,
        ventana
      );
      setVentanasemana([...ventanasemana, data.ventanaNueva]);
    } catch (error) {
      console.log('Error al agregar ventana:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarVentana = async (ventanaId: string) => {
    try {
      setLoading(true);
      await clienteAxios.delete(`/ventanas/${ventanaId}`);
      setVentanasemana(
        ventanasemana.filter((ventana) => ventana._id !== ventanaId)
      );
    } catch (error) {
      console.log('Error al eliminar ventana:', error);
    } finally {
      setLoading(false);
    }
  };

  const validarVentana = () => {
    setErrorVentana(true);
  };

  const cambiarEstadoVentana = (ventana: Ventana) => {
    setVentanasemana(
      ventanasemana.map((v) => (v._id === ventana._id ? ventana : v))
    );
  };

  const ventanaActual = (ventanaId: string) => {
    setVentanaseleccionada(
      ventanasemana.find((ventana) => ventana._id === ventanaId) || null
    );
  };

  const guardarVentanaActual = (ventana: Ventana) => {
    setVentanasemana((prevVentanas) =>
      prevVentanas.find((v) => v._id === ventana._id)
        ? prevVentanas
        : [...prevVentanas, ventana]
    );
  };

  const actualizarVentana = async (
    idSemana: string,
    idVentana: string,
    ventana: Ventana
  ) => {
    try {
      const { data } = await clienteAxios.put(
        `/ventanas/${idSemana}/${idVentana}`,
        ventana
      );
      setVentanasemana(
        ventanasemana.map((v) => (v._id === idVentana ? data : v))
      );
      setVentanaseleccionada(null);
      return data;
    } catch (error) {
      console.log('Error al actualizar ventana:', error);
    }
  };

  const limpiarVentana = () => {
    setVentanaseleccionada(null);
  };

  const limpiarVentanaSemana = () => {
    setTodasLasVentanas([]);
    setVentanasemana([]);
  };

  const contextValue: VentanaContextProps = {
    ventanasemana,
    errorventana,
    semanaSeleccionada,
    ventanaseleccionada,
    loading,
    setLoading,
    obtenerVentanasPorSemana,
    obtenerVentana,
    agregarVentana,
    eliminarVentana,
    validarVentana,
    cambiarEstadoVentana,
    guardarVentanaActual,
    actualizarVentana,
    setSemanaSeleccionada,
    limpiarVentana,
    limpiarVentanaSemana,
    cargarVentanaParaEdicion: guardarVentanaActual,
    todasLasVentanas,
    obtenerTodasLasVentanas,
    ventanaActual,
  };

  return (
    <VentanaContext.Provider value={contextValue}>
      {children}
    </VentanaContext.Provider>
  );
}
