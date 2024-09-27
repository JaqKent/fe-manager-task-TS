/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

import clienteAxios from '~config/axios';
import { useSemanaContext } from '~contexts/Semana/Semana';

import 'moment/locale/es';

moment.locale('es');

function NuevaSemanaAutomatica() {
  const { agregarSemana, obtenerSemanas } = useSemanaContext();
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [semanasYaExisten, setSemanasYaExisten] = useState(false);

  const createWeeksForYear = async (year: number) => {
    const existingWeeks = await fetchWeeks();

    const startDate = moment
      .tz(`${year}-01-01`, 'America/Argentina/Buenos_Aires')
      .startOf('year');
    const endDate = moment
      .tz(`${year}-12-31`, 'America/Argentina/Buenos_Aires')
      .endOf('year');

    const weeks = [];

    const currentStartDate = startDate
      .clone()
      .startOf('isoWeek')
      .isoWeekday(1)
      .add(1, 'week');

    const existingWeeksSet = new Set(
      existingWeeks.map((semana) =>
        moment(semana.startDate).startOf('isoWeek').format('YYYY-MM-DD')
      )
    );

    console.log('Conjunto de semanas existentes:', existingWeeksSet);

    while (currentStartDate.isBefore(endDate)) {
      const weekStart = currentStartDate.format('YYYY-MM-DD');

      if (!existingWeeksSet.has(weekStart)) {
        weeks.push({
          year: year.toString(),
          month: currentStartDate.format('MMMM'),
          startDate: currentStartDate.toDate(),
          endDate: currentStartDate.clone().add(4, 'days').toDate(),
          fechaCreacion: new Date(),
        });
      } else {
        console.log(`La semana ${weekStart} ya existe y no será añadida.`);
      }

      currentStartDate.add(1, 'week');
    }

    if (weeks.length > 0) {
      for (const semana of weeks) {
        console.log('Guardando semana:', semana);
        await agregarSemana(semana);
      }

      setMensajeConfirmacion('¡Las semanas se han creado con éxito!');
      setTimeout(() => {
        setMensajeConfirmacion('');
      }, 3000);
    } else {
      setMensajeConfirmacion(
        'Las semanas ya están creadas para el año actual.'
      );
    }

    await obtenerSemanas();
  };

  const fetchWeeks = async () => {
    try {
      const response = await clienteAxios.get('/weeks');

      return response.data;
    } catch (error: any) {
      console.error(
        'Error fetching semanas:',
        error.response ? error.response.data : error.message
      );
      return [];
    }
  };

  const initializeWeeks = async () => {
    const semanas = await fetchWeeks();
    const currentYear = new Date().getFullYear();
    const yearHasWeeks = semanas.some(
      (semana: any) => parseInt(semana.year, 10) === currentYear
    );

    if (!yearHasWeeks) {
      await createWeeksForYear(currentYear);
      setSemanasYaExisten(false);
    } else {
      setSemanasYaExisten(true);
    }
  };

  useEffect(() => {
    const lastCheck = localStorage.getItem('lastCheckDate');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastCheck || now - parseInt(lastCheck, 10) > oneDay) {
      initializeWeeks();
      localStorage.setItem('lastCheckDate', now.toString());
    }

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      if (
        now - parseInt(localStorage.getItem('lastCheckDate') || '0', 10) >
        oneDay
      ) {
        initializeWeeks();
        localStorage.setItem('lastCheckDate', now.toString());
      }
    }, oneDay);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p
        style={{
          position: 'absolute',
          top: '100px',
          left: '10px',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '18px',
          color: 'green',
        }}
      >
        {mensajeConfirmacion}
      </p>
    </div>
  );
}

export default NuevaSemanaAutomatica;
