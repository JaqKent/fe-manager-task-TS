/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '~contexts/auth/AuthContext';
import { useSemanaContext } from '~contexts/Semana/Semana';

import SemanasSidebar from '../../../Semanas/SemanaSideBar/SemanaSideBar';
import ListadoVentanaBacklog from '../ListadoVentanaBacklog/ListadoVentanaBacklog';

import styles from './styles.module.scss';

function BacklogVentanaMain() {
  const navigate = useNavigate();
  const { obtenerSemanas } = useSemanaContext();

  // Extraer la información de autenticación
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    // usuarioAutenticado();
    if (isAuthenticated == null) navigate('/');
  }, [isAuthenticated, navigate, obtenerSemanas]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Ejecutando acción cada 14 minutos');
      obtenerSemanas();
    }, 840000);
    return () => clearInterval(interval);
  }, [obtenerSemanas]);

  return (
    <div className={styles.contenedorApp}>
      <SemanasSidebar />
      <div className={styles.seccionPrincipal}>
        <main>
          <div className={styles.contenedorTareas}>
            <ListadoVentanaBacklog />
          </div>
        </main>
      </div>
    </div>
  );
}

export default BacklogVentanaMain;
