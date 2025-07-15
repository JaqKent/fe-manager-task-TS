/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import {
  Alert,
  AlertTitle,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Semana } from 'Interfaces/Semana';

import CustomModal from '~components/CustomModal/CustomModal';
import UpdateModal from '~components/UpdateModal/UpdateModal';
import VentanaIndividual from '~components/Ventanas/VenatanIndividual/VentanaIndividual';
import { ADD_ITEM_FORM, VentanaTable } from '~constants/constants';
import { useAuthContext } from '~contexts/auth/AuthContext';
import { useCommentVentanaContext } from '~contexts/CommentVentana/CommentVentana';
import { useSemanaContext } from '~contexts/Semana/Semana';
import { useVentanaContext } from '~contexts/Ventana/Ventana';

import styles from './styles.module.scss';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

function ListadoVentanaEnBacklog() {
  const [modal, setModal] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedSemana, setSelectedSemana] = useState('');
  const [semanasOptions, setSemanasOptions] = useState<Semana[]>([]);

  const { semanas } = useSemanaContext();
  const { user } = useAuthContext();

  const {
    ventanasemana,
    ventanaseleccionada,
    agregarVentana,
    actualizarVentana,
    limpiarVentana,
    semanaSeleccionada,
    obtenerVentanasPorSemana,
  } = useVentanaContext();

  const {
    commentVentanas,
    obtenerComments,
    agregarComment,
    eliminarComment,
    limpiarComments,
  } = useCommentVentanaContext();

  const semanaActual = semanas?.find((s) => s._id === semanaSeleccionada);
  const ventanasEnBacklog = ventanasemana.filter((v) => v.enBacklog);

  useEffect(() => {
    if (semanaActual?._id) {
      setLoading(true);
      obtenerVentanasPorSemana(semanaActual._id).finally(() =>
        setLoading(false)
      );
    }
    if (semanas) {
      setSemanasOptions(semanas);
    }
  }, [semanaActual?._id, semanas]);

  useEffect(() => {
    if (ventanaseleccionada?._id) {
      limpiarComments();
      obtenerComments(ventanaseleccionada._id);
    }
  }, [ventanaseleccionada?._id]);

  const formatFecha = (fecha: string | Date): string => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSubmit = async (formData: any) => {
    try {
      const base = ventanaseleccionada
        ? { ...formData, semana: selectedSemana }
        : { ...formData, semana: semanaSeleccionada };

      if (!semanaActual?._id) throw new Error('Semana actual indefinida');

      if (ventanaseleccionada?._id) {
        await actualizarVentana(
          semanaActual._id,
          ventanaseleccionada._id,
          base
        );
      } else {
        await agregarVentana(base);
      }

      await obtenerVentanasPorSemana(semanaActual._id);
      setStatusMessage('¡La Ventana se ha editado con éxito!');
      setTimeout(() => setStatusMessage(''), 3000);
      setModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowUpdate = () => {
    if (!showUpdate && ventanaseleccionada?._id) {
      setShowUpdate(true);
      setLoading(true);
      limpiarComments();
      obtenerComments(ventanaseleccionada._id).finally(() => setLoading(false));
    } else {
      setShowUpdate(false);
    }
  };

  const handleSubmitUpdate = async (formData: any) => {
    try {
      if (!ventanaseleccionada?._id) throw new Error('Ventana no seleccionada');
      const usuario = user?._id || '';
      const comentario = {
        ...formData,
        ventanas: ventanaseleccionada._id,
        usuarioCreador: usuario,
      };
      await agregarComment(comentario);
      obtenerComments(ventanaseleccionada._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUpdate = async (commentId: string) => {
    try {
      await eliminarComment(commentId);

      const idVentana = ventanaseleccionada?._id;
      if (typeof idVentana === 'string') {
        obtenerComments(idVentana);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    limpiarVentana();
    setModal(true);
  };

  const fields = ADD_ITEM_FORM.map(({ name, label, type, required }) => ({
    name,
    label,
    type,
    required,
  }));

  if (!semanaActual || ventanasemana === null)
    return <h2 className={styles.textoProyecto}>Selecciona una Semana</h2>;

  return (
    <>
      {loading ? (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      ) : (
        <>
          {statusMessage && (
            <p className={styles.mensajeConfirmacion}>{statusMessage}</p>
          )}

          <div className={styles.header}>
            <h1 className={styles.textBranch}>
              Semana: {formatFecha(semanaActual.startDate)} -{' '}
              {formatFecha(semanaActual.endDate)}
              <br />
              Año: {semanaActual.year}
            </h1>
          </div>

          <header className={styles.appHeaderBranch}>
            <nav className={styles.navPrincipal}>
              <button
                type='button'
                className={styles.buttonCrearVentana}
                onClick={openModal}
              >
                Crear Ventana
              </button>
            </nav>
          </header>

          {ventanasEnBacklog.length === 0 ? (
            <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
              <Alert severity='info'>
                <AlertTitle>Info</AlertTitle>
                <b>No hay Ventanas cargadas</b>
              </Alert>
            </Stack>
          ) : (
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='Ventana Table'>
                  <TableHead>
                    <TableRow>
                      {VentanaTable.map(({ id, label, width }) => (
                        <StyledTableCell
                          key={id}
                          align='left'
                          className={styles.tituloTable}
                          style={{ width, padding: '8px' }}
                        >
                          {label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>

              {(ventanasEnBacklog || []).map((ventana) => (
                <div key={ventana._id}>
                  <VentanaIndividual
                    ventana={ventana}
                    openModal={() => setModal(true)}
                    handleShow={handleShowUpdate}
                  />
                </div>
              ))}
            </div>
          )}

          <CustomModal
            show={modal}
            title='Ventana'
            fields={fields}
            handleSubmit={handleSubmit}
            ventanaActual={ventanaseleccionada}
            handleCloseModal={() => setModal(false)}
            selectedSemana={selectedSemana}
            setSelectedSemana={setSelectedSemana}
            semanasOptions={semanasOptions}
            handleSemanaChange={(e) => setSelectedSemana(e.target.value)}
            showWeek
            typelabel='backlog'
          />

          {commentVentanas && (
            <UpdateModal
              show={showUpdate}
              handleClose={handleShowUpdate}
              handleSubmit={handleSubmitUpdate}
              handleDeleteUpdate={handleDeleteUpdate}
              data={commentVentanas}
              title={ventanaseleccionada?.descripcion || ''}
            />
          )}
        </>
      )}
    </>
  );
}

export default ListadoVentanaEnBacklog;
