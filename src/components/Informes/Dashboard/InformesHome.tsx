/* eslint-disable import/extensions */
import Dashboard from '~components/Dashboard/Board/Board';

import styles from './styles.module.scss';

function InformesHome() {
  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <Dashboard />
    </div>
  );
}

export default InformesHome;
