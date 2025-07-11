/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
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
import { Semana } from 'Interfaces/Semana';
import { Ventana } from 'Interfaces/Ventana';

import CustomModal from '~components/CustomModal/CustomModal';
import UpdateModal from '~components/UpdateModal/UpdateModal';
import { ADD_ITEM_FORM, VentanaTable } from '~constants/constants';
import { useAuthContext } from '~contexts/auth/AuthContext';
import { useCommentVentanaContext } from '~contexts/CommentVentana/CommentVentana';
import { useSemanaContext } from '~contexts/Semana/Semana';
import { useVentanaContext } from '~contexts/Ventana/Ventana';

import VentanaIndividual from '../../../Ventanas/VenatanIndividual/VentanaIndividual';

import styles from './styles.module.scss';

function ListadoVentanaEnBacklog() {
  const [ventanaFiltered, setVentanaFiltered] = useState<Ventana[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [dataComment, setDataComment] = useState<{
    update: string;
    usuarioCreador: string;
  }>({
    update: '',
    usuarioCreador: '',
  });
  const [semanasOptions, setSemanasOptions] = useState<Semana[]>([]);
  const [selectedSemana, setSelectedSemana] = useState<string>('');
  const [mensajeConfirmacion, setMensajeConfirmacion] =
    useState<boolean>(false);

  const { semanas } = useSemanaContext();

  const { user } = useAuthContext();

  const {
    ventanasemana,
    ventanaseleccionada,
    agregarVentana,
    limpiarVentana,
    semanaSeleccionada,
    obtenerVentanasPorSemana,
    actualizarVentana,
  } = useVentanaContext();

  const {
    commentVentanas,
    obtenerComments,
    agregarComment,
    eliminarComment,
    limpiarComments,
  } = useCommentVentanaContext();

  const [newWindow, setNewWindow] = useState<{
    descripcion: string;
    solicitante: string;
    estado: string;
    fechaImplementacion: string;
    urgencia: string;
    crq: string;
    ejecutaTarea: string;
    controla: string;
    pruebasPost: string;
    afertaIdp: string;
    impactoNotificacion: string;
    enBacklog: boolean;
  }>({
    descripcion: '',
    solicitante: '',
    estado: '',
    fechaImplementacion: '',
    urgencia: '',
    crq: '',
    ejecutaTarea: '',
    controla: '',
    pruebasPost: '',
    afertaIdp: '',
    impactoNotificacion: '',
    enBacklog: false,
  });

  const obtenerIdUsuarioCreador = (): string | null => {
    const id = user?._id || null;

    return id;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setNewWindow({
      ...newWindow,
      [name]: newValue,
    });
  };
  const semanaActual = semanas?.find(
    (semana: Semana) => semana._id === semanaSeleccionada
  );

  const openModal = (): void => setModal(!modal);

  const formatFecha = (fecha: string | Date): string => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${dia}/${mes}`;
  };

  const handleSubmit = async (formData: any): Promise<void> => {
    try {
      if (ventanaseleccionada && semanaActual && semanaActual._id) {
        const ventanaActualizada = {
          ...formData,
          semana: selectedSemana,
        };
        if (!ventanaseleccionada._id) {
          throw new Error('La ventana seleccionada no tiene un ID definido');
        }
        await actualizarVentana(
          semanaActual._id,
          ventanaseleccionada._id,
          ventanaActualizada
        );
      } else if (semanaActual && semanaActual._id) {
        const ventanaConSemana = {
          ...formData,
          semana: semanaSeleccionada,
        };
        await agregarVentana(ventanaConSemana);

        setNewWindow({
          descripcion: '',
          solicitante: '',
          estado: '',
          fechaImplementacion: '',
          urgencia: '',
          crq: '',
          ejecutaTarea: '',
          controla: '',
          pruebasPost: '',
          afertaIdp: '',
          impactoNotificacion: '',
          enBacklog: false,
        });
      } else {
        // Handle the case where semanaActual or its _id is undefined
        throw new Error('Semana actual no está definida');
      }

      if (semanaActual && semanaActual._id) {
        setLoading(true);
        await obtenerVentanasPorSemana(semanaActual._id);
        setLoading(false);
      }

      openModal();
      setMensajeConfirmacion(true);

      setTimeout(() => {
        setMensajeConfirmacion(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };
  const buttonNuevaVentana = () => {
    limpiarVentana();
  };

  const handleSubmitUpdate = async (formData: any): Promise<void> => {
    try {
      const idUsuarioCreador = obtenerIdUsuarioCreador();

      if (!ventanaseleccionada) {
        throw new Error('No hay ventana seleccionada');
      }

      const updateVentana = {
        ...formData,
        ventanas: ventanaseleccionada._id,
        usuarioCreador: idUsuarioCreador ?? '',
      };

      await agregarComment(updateVentana);

      setDataComment({
        update: '',
        usuarioCreador: idUsuarioCreador ?? '',
      });

      if (ventanaseleccionada._id) {
        if (
          ventanaseleccionada &&
          typeof ventanaseleccionada._id === 'string'
        ) {
          if (
            ventanaseleccionada &&
            typeof ventanaseleccionada._id === 'string'
          ) {
            if (
              ventanaseleccionada &&
              typeof ventanaseleccionada._id === 'string'
            ) {
              obtenerComments(ventanaseleccionada._id);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUpdate = async (commentId: string) => {
    try {
      eliminarComment(commentId);
      obtenerComments(ventanaseleccionada._id);
    } catch (error) {
      console.error(error);
    } finally {
      console.log('comentario eliminado');
    }
  };
  const fields = ADD_ITEM_FORM.map((item) => ({
    name: item.name,
    label: item.label,
    type: item.type,
    required: item.required,
  }));

  useEffect(() => {
    if (semanaActual && semanaActual._id) {
      setLoading(true);
      obtenerVentanasPorSemana(semanaActual._id)
        .then(() => setLoading(false))
        .catch((error) => {
          setLoading(false);
          console.error('Error:', error);
        });
    }
    if (semanas) {
      setSemanasOptions(semanas);
    }
  }, [semanaActual, semanas]);

  useEffect(() => {
    if (ventanaseleccionada) {
      limpiarComments();
      obtenerComments(ventanaseleccionada._id);
    }
  }, [ventanaseleccionada]);

  if (!semanaActual || ventanasemana === null)
    return <h2 className={styles.textoProyecto}>Selecciona una Semana</h2>;

  const handleShow = async () => {
    if (!show && ventanaseleccionada?._id) {
      setShow(true);
      setCommentLoading(true);
      limpiarComments();
      try {
        obtenerComments(ventanaseleccionada._id);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      } finally {
        setCommentLoading(false);
      }
    } else {
      setShow(false);
    }
  };

  const search = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value.toLowerCase();
    setVentanaFiltered(
      ventanasemana.filter((ventana: Ventana) =>
        ventana.descripcion?.toLowerCase().includes(query)
      )
    );
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const ventanasEnBacklog = ventanasemana.filter(
    (ventana: Ventana) => ventana.enBacklog
  );

  return (
    <>
      {loading ? (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      ) : (
        <>
          {mensajeConfirmacion && (
            <p className={styles.mensajeConfirmacion}>
              ¡La Ventana se ha editado con éxito!
            </p>
          )}
          {semanaActual && (
            <>
              <div className={styles.header}>
                <h1 className={styles.textBranch}>
                  Semana :{' '}
                  {`${formatFecha(semanaActual.startDate)} - ${formatFecha(
                    semanaActual.endDate
                  )}`}{' '}
                  <br /> Año: {semanaActual.year}
                </h1>
              </div>
              <header className={styles.appHeaderBranch}>
                <nav className={styles.navPrincipal}>
                  <button
                    className={styles.buttonCrearVentana}
                    type='button'
                    onClick={() => {
                      buttonNuevaVentana();
                      openModal();
                    }}
                  >
                    Crear Ventana
                  </button>
                </nav>
              </header>

              {ventanasemana.length === 0 ? (
                <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
                  <Alert severity='info'>
                    <AlertTitle className='titulo-error1'>Info</AlertTitle>
                    <b className='titulo-error'>No hay Ventanas cargadas</b>
                  </Alert>
                </Stack>
              ) : (
                <div>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                      <TableHead>
                        <TableRow>
                          {VentanaTable.map((column) => (
                            <StyledTableCell
                              key={column.id}
                              align='left'
                              className={styles.tituloTable}
                              style={{ width: column.width, padding: '8px' }}
                            >
                              {column.label}
                            </StyledTableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                  {ventanaFiltered.length > 0
                    ? ventanaFiltered.map((ventana) => (
                        <div>
                          <VentanaIndividual
                            ventana={ventana}
                            openModal={openModal}
                            handleShow={handleShow}
                          />
                        </div>
                      ))
                    : ventanasEnBacklog.map((ventana: Ventana) => (
                        <div>
                          <VentanaIndividual
                            ventana={ventana}
                            openModal={openModal}
                            handleShow={handleShow}
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
                ventanaActual={ventanaseleccionada ?? undefined}
                onChange={handleChange}
                handleCloseModal={openModal}
                selectedSemana={selectedSemana}
                setSelectedSemana={setSelectedSemana}
                semanasOptions={semanasOptions}
                handleSemanaChange={(event) =>
                  setSelectedSemana(event.target.value)
                }
                showWeek
                typelabel='backlog'
              />
              <div className='modal-update'>
                {commentVentanas && (
                  <UpdateModal
                    show={show}
                    handleClose={handleShow}
                    handleSubmit={handleSubmitUpdate}
                    handleDeleteUpdate={handleDeleteUpdate}
                    data={commentVentanas}
                    title={ventanaseleccionada?.descripcion || ''}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default ListadoVentanaEnBacklog;
