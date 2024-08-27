/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Semana } from 'Interfaces/Semana';

import { useSemanaContext } from '~contexts/Semana/Semana';
import { useVentanaContext } from '~contexts/Ventana/Ventana';

import styles from './styles.module.scss';

interface SemanaProps {
  semana: Semana;
  activeButtonId?: string | null;
  onButtonClick?: (id: string) => void;
}

function SemanaIndividual({
  semana,
  activeButtonId,
  onButtonClick,
}: SemanaProps) {
  // Obtener el state del Proyecto
  const { eliminarSemana, actualizarSemana, obtenerSemanas } =
    useSemanaContext();

  const [newStartDate, setNewStartDate] = useState(semana.startDate);
  const [newEndDate, setNewEndDate] = useState(semana.endDate);
  const [editMode, setEditMode] = useState(false);

  const [reloadSemanas, setReloadSemanas] = useState(false);

  // obtener la función del context de tarea
  const { obtenerVentanasPorSemana, setSemanaSeleccionada } =
    useVentanaContext();

  // Función para agregar proyecto actual
  const seleccionarSemana = (id: string) => {
    obtenerVentanasPorSemana(id);
    setSemanaSeleccionada(id);
    onButtonClick(semana._id);
  };

  const deleteSemana = (id: string) => {
    eliminarSemana(id);
  };

  useEffect(() => {
    if (reloadSemanas) {
      obtenerSemanas();
      setReloadSemanas(false);
    }
  }, [reloadSemanas]);

  useEffect(() => {
    const limpiarSemanaSeleccionada = () => {
      setSemanaSeleccionada(null);
    };

    limpiarSemanaSeleccionada();

    return () => {
      limpiarSemanaSeleccionada();
    };
  }, []);

  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    formattedDate.setDate(formattedDate.getDate() + 1);

    const day = formattedDate.toLocaleDateString('es-ES', { day: 'numeric' });
    const month = formattedDate.toLocaleDateString('es-ES', {
      month: 'numeric',
    });

    return `${day}/${month}`;
  };

  return (
    <li>
      <div className={styles.list}>
        <button
          type='button'
          className={`${styles.butnSemana} ${
            activeButtonId === semana._id ? styles.active : ''
          }`}
          onClick={() => seleccionarSemana(semana._id)}
        >
          {`${formatDate(semana.startDate)} - ${formatDate(semana.endDate)}`}
        </button>{' '}
      </div>
    </li>
  );
}

export default SemanaIndividual;
