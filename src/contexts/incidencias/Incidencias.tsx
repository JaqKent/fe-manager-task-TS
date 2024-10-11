/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-underscore-dangle */
import { createContext, ReactNode, useContext, useState } from 'react';
import { Incidencia } from 'Interfaces/Incidencias';

import clienteAxios from '~config/axios';

interface IncidenciaContextProps {
  incidencias: Incidencia[];
  errorIncidencia: boolean;
  formulario: boolean;
  errorformulario: boolean;
  incidenciaSeleccionada: Incidencia | null;
  obtenerIncidencias: () => void;
  obtenerIncidenciaIndividual: (incidenciaId: string) => void;
  agregarIncidencia: (incidencia: Incidencia) => Promise<void>;
  validarIncidencia: () => void;
  mostrarFormulario: () => void;
  mostrarError: () => void;
  eliminarIncidencia: (incidenciaId: string) => void;
  cambiarEstadoIncidencia: (incidencia: Incidencia) => void;
  incidenciaActual: (incidenciaId: string) => void;
  guardarIncidenciaActual: (incidencia: Incidencia) => void;
  actualizarIncidencia: (
    idIncidencia: string,
    incidencia: Incidencia
  ) => Promise<any>;
  limpiarIncidencia: () => void;
  setIncidenciaSeleccionada: Incidencia | null;
}

const IncidenciaContext = createContext<IncidenciaContextProps | undefined>(
  undefined
);

export const useIncidenciaContext = () => {
  const context = useContext(IncidenciaContext);
  if (!context) {
    throw new Error(
      'useIncidenciaContext debe ser usado dentro de un IncidenciaProvider'
    );
  }
  return context;
};

export default function IncidenciaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [errorIncidencia, setErrorIncidencia] = useState(false);
  const [formulario, setFormulario] = useState(false);
  const [errorformulario, setErrorFormulario] = useState(false);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] =
    useState<Incidencia | null>(null);
  const [loading, setLoading] = useState(false);

  const obtenerIncidencias = async () => {
    try {
      const response = await clienteAxios.get('/incidencias');
      if (response.status === 200) {
        setIncidencias(response.data);
      } else {
        console.log(
          'El servidor respondió con un estado inesperado:',
          response.status
        );
      }
    } catch (error) {
      if (error.response) {
        console.log('Respuesta del servidor:', error.response.data);
      }
    }
  };

  const obtenerIncidenciaIndividual = async (incidenciaId: string) => {
    try {
      setLoading(true);
      const response = await clienteAxios.get(`/incidencias/${incidenciaId}`);
      if (incidenciaId) {
        setIncidenciaSeleccionada(response.data.incidencia);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error al obtener incidencia individual:', error);
      setLoading(false);
    }
  };

  const agregarIncidencia = async (incidencia: Incidencia) => {
    try {
      setLoading(true);
      const response = await clienteAxios.post('/incidencias', incidencia);
      if (response.status === 201) {
        setIncidencias([...incidencias, response.data.incidenciaNueva]);
        setFormulario(false);
        setErrorFormulario(false);
      } else {
        console.log(
          'El servidor respondió con un estado inesperado:',
          response.status
        );
      }
      setLoading(false);
    } catch (error) {
      console.log('Error al agregar incidencia:', error);
      setLoading(false);
    }
  };

  const eliminarIncidencia = async (incidenciaId: string) => {
    try {
      setLoading(true);
      await clienteAxios.delete(`/incidencias/${incidenciaId}`);
      setIncidencias(
        incidencias.filter((incidencia) => incidencia._id !== incidenciaId)
      );
      setIncidenciaSeleccionada(null);
      setLoading(false);
    } catch (error) {
      console.log('Error al eliminar incidencia:', error);
      setLoading(false);
    }
  };

  const cambiarEstadoIncidencia = (incidencia: Incidencia) => {
    setIncidenciaSeleccionada(incidencia);
  };

  const incidenciaActual = (incidenciaId: string) => {
    setIncidenciaSeleccionada(
      incidencias.find((incidencia) => incidencia._id === incidenciaId) || null
    );
  };

  const guardarIncidenciaActual = (incidencia: Incidencia) => {
    setIncidenciaSeleccionada(incidencia);
  };

  const actualizarIncidencia = async (
    idIncidencia: string,
    incidencia: Incidencia
  ) => {
    try {
      const response = await clienteAxios.put(
        `/incidencias/${idIncidencia}`,
        incidencia
      );
      if (response.status === 200) {
        setIncidencias(
          incidencias.map((inc) =>
            inc._id === idIncidencia ? incidencia : inc
          )
        );
        return response.data;
      }
      console.log(
        'El servidor respondió con un estado inesperado:',
        response.status
      );
      return null;
    } catch (error) {
      console.log('Error al actualizar incidencia:', error);
      return null;
    }
  };

  const limpiarIncidencia = () => {
    setIncidenciaSeleccionada(null);
  };

  const mostrarFormulario = () => {
    setFormulario(true);
  };

  const mostrarError = () => {
    setErrorFormulario(true);
  };

  const contextValue: IncidenciaContextProps = {
    incidencias,
    errorIncidencia,
    formulario,
    errorformulario,
    incidenciaSeleccionada,
    obtenerIncidencias,
    obtenerIncidenciaIndividual,
    agregarIncidencia,
    validarIncidencia: mostrarError,
    mostrarFormulario,
    mostrarError,
    eliminarIncidencia,
    cambiarEstadoIncidencia,
    incidenciaActual,
    guardarIncidenciaActual,
    actualizarIncidencia,
    limpiarIncidencia,
    setIncidenciaSeleccionada,
  };

  return (
    <IncidenciaContext.Provider value={contextValue}>
      {children}
    </IncidenciaContext.Provider>
  );
}
