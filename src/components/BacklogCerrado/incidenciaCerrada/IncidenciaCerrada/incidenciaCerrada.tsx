/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import InfoIncidencia from '~components/Incidencias/InfoIncidencia/InfoIncidencia';
import { useAuthContext } from '~contexts/auth/AuthContext';
import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';

import IncidenciaSidebarCerrada from '../IncidenciasSideBarCerrada/IncidenciaSideBarCerrada';

import styles from './styles.module.scss';

function IncidenciaCerrada() {
  const history = useNavigate();

  const { obtenerIncidencias } = useIncidenciaContext();

  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    // usuarioAutenticado();
    if (isAuthenticated == null) history('/');
  }, [isAuthenticated, history, obtenerIncidencias]);

  return (
    <div className={styles.contenedorApp}>
      <IncidenciaSidebarCerrada />
      <div className={styles.seccionPrincipal}>
        <main>
          <div className={styles.contenedorTareas}>
            <InfoIncidencia />
          </div>
        </main>
      </div>
    </div>
  );
}

export default IncidenciaCerrada;
