/* eslint-disable react/require-default-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Incidencia } from 'Interfaces/Incidencias';

import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';

import styles from './styles.module.scss';

interface Props {
  activeButtonId?: string | null;
  onButtonClick?: (id: string) => void;
  incidencia?: Incidencia;
}

function IncidenciaUnica({ incidencia, activeButtonId, onButtonClick }: Props) {
  const {
    incidenciaActual,
    eliminarIncidencia,
    obtenerIncidenciaIndividual,
    limpiarIncidencia,
  } = useIncidenciaContext();

  useEffect(() => {
    limpiarIncidencia();
  }, []);

  const seleccionarIncidencia = (id: string) => {
    obtenerIncidenciaIndividual(incidencia._id);
    incidenciaActual(incidencia._id);
    onButtonClick(incidencia._id);
  };

  const deleteIncidencia = (id: string) => {
    eliminarIncidencia(id);
  };

  return (
    <li className={styles.list}>
      <button
        type='button'
        className={`${styles.butnIncidencia} ${
          activeButtonId === incidencia._id ? styles.active : ''
        }`}
        onClick={() => seleccionarIncidencia(incidencia._id)}
      >
        <p>{incidencia.descripcion}</p>
      </button>
      <div className={styles.butnOrder}>
        <button
          type='button'
          className={styles.butnBorrar}
          onClick={() => deleteIncidencia(incidencia._id)}
        >
          x
        </button>
      </div>
    </li>
  );
}

export default IncidenciaUnica;
