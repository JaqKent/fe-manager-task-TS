/* eslint-disable import/extensions */
/* eslint-disable react/no-unknown-property */
/* eslint-disable max-lines */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import CustomModal from '~components/CustomModal/CustomModal';
import UpdateModal from '~components/UpdateModal/UpdateModal';
import { ADD_ITEM_INCIDENCIA, IncidenciaTable } from '~constants/constants';
import { useAuthContext } from '~contexts/auth/AuthContext';
import { useCommentIncidenciaContext } from '~contexts/CommentIncidencia/CommentIncidencia';
import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';

import DataIncidencias from '../DataIncidencias/DataIncidencias';

import styles from './styles.module.scss';

function ListadoInfoIncidencia() {
  const [modal, setModal] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] =
    useState<boolean>(false);
  const [shouldFetchIncidencia, setShouldFetchIncidencia] = useState(false);

  const [dataComment, setDataComment] = useState<{
    update: string;
    usuarioCreador: string;
  }>({
    update: '',
    usuarioCreador: '',
  });

  const location = useLocation();

  const {
    incidencias,
    incidenciaSeleccionada,
    obtenerIncidenciaIndividual,
    actualizarIncidencia,
    limpiarIncidencia,
  } = useIncidenciaContext();

  const {
    commentIncidencias,
    obtenerComments,
    agregarComment,
    eliminarComment,
    limpiarComments,
  } = useCommentIncidenciaContext();

  const { user } = useAuthContext();

  const obtenerIdUsuarioCreador = (): string | null => {
    const id = user?._id || null;

    return id;
  };

  const [newincidencia, setNewincidencia] = useState<{
    incidenciaNumber: string;
    criticidad: string;
    fechaModificacion: string;
    asignado: string;
    estado: string;
    observaciones: string;
  }>({
    incidenciaNumber: '',
    criticidad: '',
    fechaModificacion: '',
    asignado: '',
    estado: '',
    observaciones: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewincidencia({
      ...newincidencia,
      [name]: value,
    });
  };

  const formatFecha = (fecha: string): string => {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear().toString();
    return `${dia}-${mes}-${anio}`;
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (incidenciaSeleccionada) {
        const incidenciaActualizada = {
          ...formData,
        };

        await actualizarIncidencia(
          incidenciaSeleccionada._id,
          incidenciaActualizada
        );

        openModal();
        setMensajeConfirmacion(true);
        setTimeout(() => {
          setMensajeConfirmacion(false);
        }, 3000);
      } else {
        console.log(
          'No se ha seleccionado una incidencia existente para editar.'
        );
      }
      setLocalLoading(true);
      obtenerIncidenciaIndividual(incidenciaSeleccionada._id);

      setLocalLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitUpdate = async (formData: any) => {
    try {
      const idUsuarioCreador = obtenerIdUsuarioCreador();

      if (!incidenciaSeleccionada || !incidenciaSeleccionada._id) {
        return;
      }

      const updateIncidencia = {
        ...formData,
        incidencias: incidenciaSeleccionada._id,
        usuarioCreador: idUsuarioCreador,
      };

      await agregarComment(updateIncidencia);

      setDataComment({
        update: '',
        usuarioCreador: idUsuarioCreador,
      });

      await obtenerComments(incidenciaSeleccionada._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShow = async () => {
    if (!show) {
      setShow(true);
      setCommentLoading(true);

      await obtenerComments(incidenciaSeleccionada._id);

      setCommentLoading(false);
    } else {
      setShow(false);
      limpiarComments();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCommentLoading(true);
        await obtenerComments(incidenciaSeleccionada._id);
      } catch (error) {
        console.error(error);
      } finally {
        setCommentLoading(false);
      }
    };

    if (show && incidenciaSeleccionada) {
      fetchData();
    }
  }, [show, incidenciaSeleccionada]);

  const handleDeleteUpdate = async (commentId: string) => {
    try {
      await eliminarComment(commentId);
      await obtenerComments(incidenciaSeleccionada._id);
    } catch (error) {
      console.error(error);
    } finally {
      console.log('comentario eliminado');
    }
  };

  const fields = ADD_ITEM_INCIDENCIA.map((item) => ({
    name: item.name,
    label: item.label,
    type: item.type,
    required: item.required,
  }));

  useEffect(() => {
    if (
      shouldFetchIncidencia &&
      incidenciaSeleccionada &&
      incidenciaSeleccionada._id
    ) {
      setLocalLoading(true);
      obtenerIncidenciaIndividual(incidenciaSeleccionada._id)
        .then(() => {
          setTimeout(() => {
            setLocalLoading(false);
          }, 1000);
        })
        .catch((error) => {
          setLocalLoading(false);
        });

      setShouldFetchIncidencia(false);
    }
  }, [shouldFetchIncidencia, incidenciaSeleccionada]);

  useEffect(() => {
    limpiarIncidencia();
    setShouldFetchIncidencia(true);
  }, [location.pathname]);

  const openModal = () => setModal(!modal);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  useEffect(() => {
    limpiarIncidencia();
  }, [location.pathname]);

  if (incidenciaSeleccionada === null) {
    return <h2 className={styles.textoProyecto}>Selecciona una incidencia</h2>;
  }

  return localLoading ? (
    <div className={styles.spinner}>
      <Spinner />
    </div>
  ) : (
    <div className={styles.container}>
      {mensajeConfirmacion && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity='info' onClose={() => setMensajeConfirmacion(false)}>
            <AlertTitle>¡Éxito!</AlertTitle>
            Se ha actualizado la incidencia correctamente.
          </Alert>
        </Stack>
      )}
      <h1 className={styles.textBranch}>
        {incidenciaSeleccionada.incidenciaNumber}
      </h1>

      {incidencias.length === 0 ? (
        <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
          <Alert severity='warning'>
            <AlertTitle className='titulo-error1'>Info</AlertTitle>
            <b className='titulo-error'>No hay incidencia cargada</b>
          </Alert>
        </Stack>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {IncidenciaTable.map((field) => (
                    <StyledTableCell
                      key={field.id}
                      align='left'
                      className={styles.tituloTable}
                      style={{ width: field.width }}
                    >
                      {field.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>

          {incidenciaSeleccionada && (
            <div>
              <DataIncidencias
                incidencia={incidenciaSeleccionada}
                openModal={openModal}
                handleShow={handleShow}
              />
            </div>
          )}

          <CustomModal
            show={modal}
            title='Incidencia'
            handleCloseModal={openModal}
            handleSubmit={handleSubmit}
            ventanaActual={incidenciaSeleccionada}
            fields={fields}
          />
          <div>
            {commentIncidencias && (
              <UpdateModal
                show={show}
                handleClose={handleShow}
                handleSubmit={handleSubmitUpdate}
                handleDeleteUpdate={handleDeleteUpdate}
                data={commentIncidencias}
                title={incidenciaSeleccionada.descripcion}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ListadoInfoIncidencia;
