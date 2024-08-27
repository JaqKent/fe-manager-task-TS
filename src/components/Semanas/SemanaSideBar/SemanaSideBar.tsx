/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import MonthButton from '~components/CustomButtons/MonthButton';
import YearButton from '~components/CustomButtons/YearButton';
import { useSemanaContext } from '~contexts/Semana/Semana';

import ListadoSemanas from '../ListadoSemanas/ListadoSemanas';

import styles from './styles.module.scss';

// Definimos interfaces para los tipos de datos utilizados

function SemanasSidebar() {
  const semanasContext = useSemanaContext();
  const { semanas, obtenerSemanas } = semanasContext;
  const [aniosDisponibles, setAniosDisponibles] = useState<string[]>([]);
  const [mesesDisponibles, setMesesDisponibles] = useState<number[]>([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState<string>('');
  const [mesSeleccionado, setMesSeleccionado] = useState<number | ''>('');

  useEffect(() => {
    const obtenerAniosUnicos = () => {
      const aniosUnicos = Array.from(
        new Set(semanas?.map((semana) => semana.year))
      );
      setAniosDisponibles(aniosUnicos);
    };

    obtenerAniosUnicos();
  }, [semanas]);

  useEffect(() => {
    if (anioSeleccionado) {
      const mesesUnicos = Array.from(
        new Set(
          semanas
            .filter((semana) => semana.year === anioSeleccionado)
            .map((semana) => semana.month)
        )
      );
      setMesesDisponibles(mesesUnicos);
    }
  }, [semanas, anioSeleccionado]);

  useEffect(() => {
    obtenerSemanas();
  }, []);

  const ordenarMeses = (mesA: string, mesB: string): number => {
    const ordenMeses = [
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
    return ordenMeses.indexOf(mesA) - ordenMeses.indexOf(mesB);
  };

  const seleccionarAnio = (year: string) => {
    setAnioSeleccionado(year);
    setMesSeleccionado('');
  };

  const seleccionarMes = (month: any) => {
    setMesSeleccionado(month);
  };

  return (
    <aside>
      <div className={styles.proyectos}>
        <div className={styles.monthYears}>
          <h3 className={styles.mesesAnoFonts}>Años disponibles:</h3>
          <div className={styles.container}>
            {aniosDisponibles.sort().map((year) => (
              <YearButton
                className={`${styles.butnPrimario} ${
                  year === anioSeleccionado ? styles.active : ''
                }`}
                key={year}
                year={year}
                onClick={() => seleccionarAnio(year)}
              />
            ))}
          </div>
        </div>
        {anioSeleccionado && (
          <div className={styles.monthYears}>
            <h3 className={styles.mesesAnoFonts}>Meses disponibles:</h3>
            <div className={styles.container}>
              {mesesDisponibles.sort(ordenarMeses).map((mes) => (
                <MonthButton
                  className={`${styles.butnPrimario} ${
                    mes === mesSeleccionado ? styles.active : ''
                  }`}
                  key={mes}
                  month={mes}
                  onClick={() => seleccionarMes(mes)}
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles.contenedorTareas}>
          {mesSeleccionado ? (
            <>
              <h2>Semanas</h2>

              <ListadoSemanas
                anioSeleccionado={anioSeleccionado}
                mesSeleccionado={mesSeleccionado}
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

export default SemanasSidebar;
