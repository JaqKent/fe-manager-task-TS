/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import MonthButtonIncidencia from '~components/CustomButtons/MonthButton';
import YearButton from '~components/CustomButtons/YearButton';
import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';

import ListadoIncidencia from '../ListadoIncidencia/ListadoIncidencia';
import NuevaIncidencia from '../NuevaIncidencia/NuevaIncidencia';

import styles from './styles.module.scss';

function IncidenciaSidebar() {
  const { obtenerIncidencias, incidencias } = useIncidenciaContext();

  const [aniosDisponiblesIncidencia, setAniosDisponiblesIncidencia] = useState<
    string[]
  >([]);
  const [mesesDisponiblesIncidencia, setMesesDisponiblesIncidencia] = useState<
    string[]
  >([]);
  const [anioSeleccionadoIncidencia, setAnioSeleccionadoIncidencia] =
    useState<string>('');
  const [mesSeleccionadoIncidencia, setMesSeleccionadoIncidencia] =
    useState<string>('');

  useEffect(() => {
    obtenerIncidencias();
  }, []);

  const ordenarMesesIncidencia = (mesA: string, mesB: string): number => {
    const ordenMesesIncidencia = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return (
      ordenMesesIncidencia.indexOf(mesA) - ordenMesesIncidencia.indexOf(mesB)
    );
  };

  useEffect(() => {
    const obtenerAniosUnicosIncidencia = () => {
      const aniosUnicosIncidencia = Array.from(
        new Set(incidencias.map((incidencia) => incidencia.year))
      );
      setAniosDisponiblesIncidencia(aniosUnicosIncidencia);
    };

    obtenerAniosUnicosIncidencia();
  }, [incidencias]);

  useEffect(() => {
    if (anioSeleccionadoIncidencia) {
      const mesesUnicosIncidencia = Array.from(
        new Set(
          incidencias
            .filter(
              (incidencia) => incidencia.year === anioSeleccionadoIncidencia
            )
            .map((incidencia) => incidencia.month)
        )
      );
      setMesesDisponiblesIncidencia(mesesUnicosIncidencia);
    }
  }, [incidencias, anioSeleccionadoIncidencia]);

  const seleccionarAnioIncidencia = (year: string) => {
    setAnioSeleccionadoIncidencia(year);
    setMesSeleccionadoIncidencia('');
  };

  const seleccionarMesIncidencia = (month: string) => {
    setMesSeleccionadoIncidencia(month);
  };

  return (
    <aside>
      <div className={styles.proyectos}>
        <div>
          <h3 className={styles.mesesAnoFonts}>Años disponibles:</h3>
          <div className={styles.container}>
            {aniosDisponiblesIncidencia.sort().map((year) => (
              <YearButton
                className={`${styles.butnPrimario} ${
                  year === anioSeleccionadoIncidencia ? styles.active : ''
                }`}
                key={year}
                year={year}
                onClick={() => seleccionarAnioIncidencia(year)}
              />
            ))}
          </div>
        </div>
        {anioSeleccionadoIncidencia && (
          <div>
            <h3 className={styles.mesesAnoFonts}>Meses disponibles:</h3>
            <div className={styles.container}>
              {mesesDisponiblesIncidencia
                .sort(ordenarMesesIncidencia)
                .map((mes) => (
                  <MonthButtonIncidencia
                    className={`${styles.butnPrimario} ${
                      mes === mesSeleccionadoIncidencia ? styles.active : ''
                    }`}
                    key={mes}
                    month={mes}
                    onClick={() => seleccionarMesIncidencia(mes)}
                  />
                ))}
            </div>
          </div>
        )}

        <div className={styles.contenedorTareas}>
          {mesSeleccionadoIncidencia ? (
            <>
              <h2>Incidencias</h2>
              <NuevaIncidencia />
              <ListadoIncidencia
                anioSeleccionadoIncidencia={anioSeleccionadoIncidencia}
                mesSeleccionadoIncidencia={mesSeleccionadoIncidencia}
                mostrarEnBacklog={false}
              />
            </>
          ) : (
            <h2>Seleccionar una fecha</h2>
          )}
        </div>
      </div>
    </aside>
  );
}

export default IncidenciaSidebar;
