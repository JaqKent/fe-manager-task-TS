/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Semana } from 'Interfaces/Semana';

import { useSemanaContext } from '~contexts/Semana/Semana';

import SemanaIndividual from '../SemanaIndividual/SemanaIndividual';

import styles from './styles.module.scss';

interface ListadoSemanasProps {
  anioSeleccionado: any;
  mesSeleccionado: any;
}

function ListadoSemanas({
  anioSeleccionado,
  mesSeleccionado,
}: ListadoSemanasProps) {
  const { semanas } = useSemanaContext();

  const [semanasFiltradas, setSemanasFiltradas] = useState<Semana[]>([]);
  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);

  const handleButtonClick = (id: string) => {
    setActiveButtonId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    if (anioSeleccionado && mesSeleccionado) {
      const semanasFiltradas = semanas.filter(
        (semana) =>
          semana.year === anioSeleccionado && semana.month === mesSeleccionado
      );
      setSemanasFiltradas(semanasFiltradas);
    } else {
      setSemanasFiltradas([]);
    }
  }, [semanas, anioSeleccionado, mesSeleccionado]);

  return (
    <ul className={styles.listadoProyectos}>
      {mesSeleccionado ? (
        semanasFiltradas.length === 0 ? (
          <h2>No hay semanas para el mes seleccionado</h2>
        ) : (
          semanasFiltradas.map((semana) => (
            <SemanaIndividual
              key={semana._id}
              semana={semana}
              activeButtonId={activeButtonId}
              onButtonClick={handleButtonClick}
            />
          ))
        )
      ) : (
        <h2>Seleccionar un Mes</h2>
      )}
    </ul>
  );
}

export default ListadoSemanas;
