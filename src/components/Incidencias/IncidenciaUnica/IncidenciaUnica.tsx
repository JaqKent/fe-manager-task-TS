/* eslint-disable react/require-default-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Incidencia } from 'Interfaces/Incidencias';

import ModalDelete from '~components/CustomModal/ModalDelete/ModalDelete'; // Asegúrate de que la ruta sea correcta
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

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [incidenciaAEliminar, setIncidenciaAEliminar] =
    useState<Incidencia | null>(null);

  useEffect(() => {
    limpiarIncidencia();
  }, []);

  const seleccionarIncidencia = (id: string) => {
    obtenerIncidenciaIndividual(incidencia._id);
    incidenciaActual(incidencia._id);
    if (onButtonClick) {
      onButtonClick(incidencia._id);
    }
  };

  const handleEliminarIncidencia = () => {
    if (incidenciaAEliminar) {
      eliminarIncidencia(incidenciaAEliminar._id);
      setDeleteModalOpen(false); // Cerrar el modal después de eliminar
    }
  };

  return (
    <>
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
            onClick={() => {
              setIncidenciaAEliminar(incidencia);
              setDeleteModalOpen(true);
            }}
          >
            x
          </button>
        </div>
      </li>

      {isDeleteModalOpen && (
        <ModalDelete
          onClick={handleEliminarIncidencia}
          close={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
}

export default IncidenciaUnica;
