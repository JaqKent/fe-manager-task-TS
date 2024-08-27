import { useEffect, useState } from 'react';

import clienteAxios from '../../../config/axios';

import styles from './styles.module.scss';

interface Semana {
  _id: string;
  startDate: string;
}

interface Ventana {
  _id: string;
  descripcion: string;
}

interface ReminderProps {
  mostrarRecordatorio: boolean;
  setMostrarRecordatorio: React.Dispatch<React.SetStateAction<boolean>>;
}

function Reminder({
  mostrarRecordatorio,
  setMostrarRecordatorio,
}: ReminderProps) {
  const [pausado, setPausado] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [pausaTimeoutId, setPausaTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const [ventanasemanaReminder, setVentanasemanaReminder] = useState<
    Ventana[] | null
  >(null);
  const [semanas, setSemanas] = useState<Semana[]>([]);

  const obtenerSemanaSiguiente = (semanas: Semana[]): Semana | null => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const proximaSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);

    const semanaSiguiente = semanas
      .filter((semana) => {
        const startDate = new Date(semana.startDate);
        startDate.setHours(0, 0, 0, 0);
        return startDate >= hoy && startDate <= proximaSemana;
      })
      .reduce<Semana | null>((prev, curr) => {
        return !prev || new Date(curr.startDate) < new Date(prev.startDate)
          ? curr
          : prev;
      }, null);

    return semanaSiguiente;
  };

  useEffect(() => {
    const obtenerSemanas = async () => {
      try {
        const resultado = await clienteAxios.get<Semana[]>('/weeks');

        setSemanas(resultado.data);
      } catch (error) {
        console.error('Error al obtener semanas:', error);
      }
    };

    obtenerSemanas();
  }, []);

  useEffect(() => {
    const cargarVentanas = async () => {
      try {
        const semanaSiguiente = obtenerSemanaSiguiente(semanas);

        if (semanaSiguiente) {
          const resultado = await clienteAxios.get<Ventana[]>(
            `/ventanas/${semanaSiguiente._id}`
          );

          setVentanasemanaReminder(resultado.data);
        } else {
          console.log('No hay semana siguiente');
        }
      } catch (error) {
        console.error('Error al obtener ventanas:', error);
      }
    };

    const verificarRecordatorio = () => {
      const ahora = new Date();
      const horaArgentina = ahora.getUTCHours() - 3;

      if (
        (ahora.getDay() === 5 && horaArgentina === 10 && !pausado) ||
        testing
      ) {
        setMostrarRecordatorio(true);
      } else {
        setMostrarRecordatorio(false);
      }
    };

    const timerId = setTimeout(() => {
      verificarRecordatorio();
    }, 1000);

    cargarVentanas();
    verificarRecordatorio();

    return () => {
      clearTimeout(timerId);
    };
  }, [pausado, testing, semanas]);

  const pausarRecordatorio = () => {
    setPausado(true);
    setMostrarRecordatorio(false);
    const timeoutId = setTimeout(
      () => {
        setPausado(false);
      },
      60 * 60 * 1000
    );

    if (pausaTimeoutId) {
      clearTimeout(pausaTimeoutId);
    }

    setPausaTimeoutId(timeoutId);
  };

  const cerrarRecordatorio = () => {
    setMostrarRecordatorio(false);
  };

  return mostrarRecordatorio ? (
    <div className={styles.reminder}>
      {ventanasemanaReminder && ventanasemanaReminder.length > 0 ? (
        <div>
          <div className={styles.listaRemnder}>
            <p>Ventanas para la próxima semana:</p>
            <ol>
              {ventanasemanaReminder.map((ventana) => (
                <li className={styles.orderlistReminder} key={ventana._id}>
                  {ventana.descripcion}
                </li>
              ))}
            </ol>
          </div>
          <button
            type='button'
            className={styles.reminderButn}
            onClick={pausarRecordatorio}
            disabled={pausado}
            style={{ color: 'black' }}
          >
            Pausar
          </button>
          <button
            type='button'
            className={styles.butnBorrar}
            onClick={cerrarRecordatorio}
          >
            Cerrar
          </button>
        </div>
      ) : (
        <p>No hay ventanas disponibles para la semana siguiente</p>
      )}
    </div>
  ) : null;
}

export default Reminder;
