/* eslint-disable import/extensions */
import { useState } from 'react';

import CustomModal from '~components/CustomModal/CustomModal';
import { ADD_ITEM_INCIDENCIA, meses } from '~constants/constants';
import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';

import styles from './styles.module.scss';

interface FormData {
  [key: string]: any;
  month?: string;
}

function NuevaIncidencia() {
  const { agregarIncidencia, obtenerIncidencias } = useIncidenciaContext();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [mensajeConfirmacion, setMensajeConfirmacion] =
    useState<boolean>(false);

  const handleSubmit = (formData: FormData) => {
    const formDataWithMonth = { ...formData, month: selectedMonth };
    agregarIncidencia(formDataWithMonth);
    setShowModal(false);
    obtenerIncidencias();
    setMensajeConfirmacion(true);
    setTimeout(() => {
      setMensajeConfirmacion(false);
    }, 3000);
  };

  return (
    <>
      <button
        type='button'
        className={styles.button}
        onClick={() => setShowModal(true)}
      >
        Nueva Incidencia
      </button>

      <CustomModal
        show={showModal}
        handleCloseModal={() => setShowModal(false)}
        title='Nueva Incidencia'
        handleSubmit={handleSubmit}
        fields={[...ADD_ITEM_INCIDENCIA]}
        meses={meses}
        typelabel='cerrada'
        setSelectedMonth={setSelectedMonth}
        selectedMonth={selectedMonth}
        mes
      />

      {mensajeConfirmacion && (
        <p className={styles.mensajeAlert}>
          ¡La incidencia se ha creado con éxito!
        </p>
      )}
    </>
  );
}

export default NuevaIncidencia;
