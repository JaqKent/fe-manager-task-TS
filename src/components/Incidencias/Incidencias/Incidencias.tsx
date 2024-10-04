/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '~components/Layout/Searchbar/SearchBar';
import { useAuthContext } from '~contexts/auth/AuthContext';
import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';

import IncidenciaSidebar from '../IncidenciasSideBar/IncidenciaSideBar';
import InfoIncidencia from '../InfoIncidencia/InfoIncidencia';

import styles from './styles.module.scss';

function Incidencias() {
  const history = useNavigate();

  const { obtenerIncidencias } = useIncidenciaContext();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated == null) history('/');
  }, [isAuthenticated, history, obtenerIncidencias]);

  return (
    <div className={styles.contenedorApp}>
      <IncidenciaSidebar />
      <div className={styles.seccionPrincipal}>
        <main>
          <div className={styles.contenedorTareas}>
            <div className={styles.searchBarContainer}>
              <SearchBar ClassName={styles.searchBar} onlyIncidencias />
            </div>
            <div>
              <InfoIncidencia />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Incidencias;
