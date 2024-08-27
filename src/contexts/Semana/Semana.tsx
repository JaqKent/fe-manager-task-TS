/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, ReactNode, useContext, useState } from 'react';
import { Semana } from 'Interfaces/Semana';

import clienteAxios from '../../config/axios';

interface SemanaContextProps {
  semanas: Semana[];
  formulario: boolean;
  errorformulario: boolean;
  semana: Semana | null;
  mensaje: string | null;
  mostrarFormulario: () => void;
  obtenerSemanas: () => void;
  agregarSemana: (semana: Semana) => Promise<void>;
  mostrarError: () => void;
  semanaActual: (semanaId: string) => void;
  eliminarSemana: (semanaId: string) => void;
  limpiarSemana: () => void;
  limpiarSemanas: () => void;
  actualizarSemana: (semana: Semana) => Promise<void>;
}

const SemanaContext = createContext<SemanaContextProps | undefined>(undefined);

export const useSemanaContext = () => {
  const context = useContext(SemanaContext);
  if (!context) {
    throw new Error(
      'useSemanaContext debe ser usado dentro de un SemanaProvider'
    );
  }
  return context;
};

export default function SemanaProvider({ children }: { children: ReactNode }) {
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [formulario, setFormulario] = useState(false);
  const [errorformulario, setErrorFormulario] = useState(false);
  const [semana, setSemana] = useState<Semana | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const mostrarFormulario = () => {
    setFormulario(true);
  };

  const obtenerSemanas = async () => {
    try {
      const response = await clienteAxios.get('/weeks');
      setSemanas(response.data);
    } catch (error) {
      setMensaje('Hubo un error');
      setErrorFormulario(true);
    }
  };

  const agregarSemana = async (semana: Semana) => {
    try {
      const response = await clienteAxios.post('/weeks', semana);
      setSemanas([...semanas, response.data]);
      setFormulario(false);
      setErrorFormulario(false);
    } catch (error) {
      setMensaje('Hubo un error');
      setErrorFormulario(true);
    }
  };

  const mostrarError = () => {
    setErrorFormulario(true);
  };

  const semanaActual = (semanaId: string) => {
    const selectedSemana = semanas.find((s) => s._id === semanaId) || null;
    setSemana(selectedSemana);
  };

  const actualizarSemana = async (semana: Semana) => {
    try {
      const response = await clienteAxios.put(`/weeks/${semana._id}`, semana);
      setSemanas(
        semanas.map((s) => (s._id === semana._id ? response.data : s))
      );
      setSemana(null);
    } catch (error) {
      setMensaje('Hubo un error al actualizar');
      setErrorFormulario(true);
    }
  };

  const limpiarSemana = () => {
    setSemana(null);
  };

  const limpiarSemanas = () => {
    setSemanas([]);
  };

  const eliminarSemana = async (semanaId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar el ítem?')) {
      try {
        await clienteAxios.delete(`/weeks/${semanaId}`);
        setSemanas(semanas.filter((s) => s._id !== semanaId));
        setSemana(null);
      } catch (error) {
        setMensaje('Hubo un error');
        setErrorFormulario(true);
      }
    }
  };

  const contextValue: SemanaContextProps = {
    semanas,
    formulario,
    errorformulario,
    semana,
    mensaje,
    mostrarFormulario,
    obtenerSemanas,
    agregarSemana,
    mostrarError,
    semanaActual,
    eliminarSemana,
    limpiarSemana,
    limpiarSemanas,
    actualizarSemana,
  };

  return (
    <SemanaContext.Provider value={contextValue}>
      {children}
    </SemanaContext.Provider>
  );
}
