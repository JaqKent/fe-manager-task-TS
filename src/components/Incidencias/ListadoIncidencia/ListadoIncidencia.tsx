/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Incidencia } from 'Interfaces/Incidencias';

import AlertaContext from '~contexts/alert/AlertContext';
import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';

import IncidenciaUnica from '../IncidenciaUnica/IncidenciaUnica';

import styles from './styles.module.scss';

interface ListadoIncidenciaProps {
  anioSeleccionadoIncidencia: string;
  mesSeleccionadoIncidencia: string;
  mostrarEnBacklog: boolean;
}

function ListadoIncidencia({
  anioSeleccionadoIncidencia,
  mesSeleccionadoIncidencia,
  mostrarEnBacklog,
}: ListadoIncidenciaProps) {
  const {
    incidencias,
    obtenerIncidencias,
    limpiarIncidencia,
    setIncidenciaSeleccionada,
  } = useIncidenciaContext();
  const { alerta } = useContext(AlertaContext);
  const location = useLocation();

  const [incidenciasFiltradas, setIncidenciasFiltradas] = useState<
    Incidencia[]
  >([]);
  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);

  const handleButtonClick = (id: string) => {
    setActiveButtonId((prevId) => (prevId === id ? null : id));
    const incidenciaSeleccionada = incidencias.find(
      (incidencia) => incidencia._id === id
    );
    setIncidenciaSeleccionada(incidenciaSeleccionada);
  };

  useEffect(() => {
    obtenerIncidencias();
  }, []);

  useEffect(() => {
    const filtrarIncidencias = () => {
      const filtradas = incidencias.filter(
        (incidencia) =>
          incidencia.year === anioSeleccionadoIncidencia &&
          incidencia.month === mesSeleccionadoIncidencia &&
          incidencia.enBacklog === mostrarEnBacklog
      );
      setIncidenciasFiltradas(filtradas);
    };

    filtrarIncidencias();
  }, [
    incidencias,
    anioSeleccionadoIncidencia,
    mesSeleccionadoIncidencia,
    mostrarEnBacklog,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      obtenerIncidencias();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    limpiarIncidencia();
  }, [location.pathname]);

  if (incidencias.length === 0) {
    return <p>Crear una Incidencia para comenzar</p>;
  }

  return (
    <ul className={styles.listadoProyectos}>
      {alerta && <div className={styles.alerta}>Sin Incidencias Cargadas</div>}
      {mesSeleccionadoIncidencia ? (
        incidenciasFiltradas.length === 0 ? (
          <h2>No hay incidencias para el mes seleccionado</h2>
        ) : (
          incidenciasFiltradas.map((incidencia) => (
            <IncidenciaUnica
              key={incidencia._id}
              incidencia={incidencia}
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

export default ListadoIncidencia;
