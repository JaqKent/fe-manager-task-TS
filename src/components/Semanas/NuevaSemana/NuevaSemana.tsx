import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { useSemanaContext } from '~contexts/Semana/Semana';

import 'moment/locale/es'; // Importa el idioma español

// Establece el idioma a español
moment.locale('es');

function NuevaSemanaAutomatica() {
  const { agregarSemana, obtenerSemanas } = useSemanaContext();
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [modoPrueba, setModoPrueba] = useState(false); // Nuevo estado para el modo de prueba

  const createWeeksForYear = async (year: number) => {
    // Obtiene las semanas existentes del contexto para el año actual
    const existingWeeks = await fetchWeeks();
    const startDate = moment().year(year).startOf('year');
    const endDate = moment().year(year).endOf('year');

    const weeks = [];
    const currentStartDate = startDate.clone().startOf('isoWeek').isoWeekday(1); // Comienza el lunes de la primera semana

    while (currentStartDate.isBefore(endDate)) {
      const currentEndDate = currentStartDate.clone().add(4, 'days'); // Solo de lunes a viernes

      const newWeek = {
        year: year.toString(),
        month: currentStartDate.format('MMMM'), // Nombre del mes en español
        startDate: currentStartDate.toDate(),
        endDate: currentEndDate.toDate(),
        fechaCreacion: new Date(),
      };

      // Verifica si la semana ya existe en las semanas existentes
      const exists = existingWeeks.some((semana) =>
        moment(semana.startDate).isSame(newWeek.startDate, 'week')
      );

      if (!exists) {
        weeks.push(newWeek);
      }

      currentStartDate.add(1, 'week'); // Mover a la siguiente semana
    }

    if (weeks.length > 0) {
      // Guardar las semanas en el contexto
      for (const semana of weeks) {
        await agregarSemana(semana); // Asegúrate de que agregarSemana sea una función asincrónica si es necesario
      }

      // Confirmación
      setMensajeConfirmacion('¡Las semanas se han creado con éxito!');
      setTimeout(() => {
        setMensajeConfirmacion('');
      }, 3000);
    } else {
      setMensajeConfirmacion(
        'Las semanas ya están creadas para el año actual.'
      );
    }

    // Actualiza la lista de semanas después de agregar nuevas
    await obtenerSemanas();
  };

  const fetchWeeks = async () => {
    try {
      const response = await fetch('/api/weeks');
      const semanas = await response.json();
      return semanas;
    } catch (error) {
      console.error('Error fetching semanas:', error);
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
    } else {
      setMensajeConfirmacion(
        'Las semanas ya están creadas para el año actual.'
      );
    }
  };

  useEffect(() => {
    if (modoPrueba) {
      initializeWeeks(); // Ejecuta la inicialización inmediatamente en modo prueba
      return; // No realiza la verificación automática en modo prueba
    }

    const lastCheck = localStorage.getItem('lastCheckDate');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

    // Inicializa semanas si no hay datos o si ha pasado un día desde la última verificación
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
  }, [modoPrueba]); // Dependencia para actualizar si cambia el modo de prueba

  const handleCreateWeeksForTesting = () => {
    setModoPrueba(false);
  };

  return (
    <div>
      <p
        style={{
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
