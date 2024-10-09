/* eslint-disable import/extensions */
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  faChevronDown,
  faChevronUp,
  faComment,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Ventana } from 'Interfaces/Ventana';

import ModalDelete from '~components/CustomModal/ModalDelete/ModalDelete';
import { getVentanaCells } from '~constants/constants';
import { useVentanaContext } from '~contexts/Ventana/Ventana';

import styles from './styles.module.scss';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface VentanaProps {
  ventana: Ventana;
  openModal?: () => void;
  handleShow?: () => void;
}

function VentanaIndividual({ ventana, openModal, handleShow }: VentanaProps) {
  const { eliminarVentana, ventanaActual, guardarVentanaActual } =
    useVentanaContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [ventanaAEliminar, setVentanaAEliminar] = useState<Ventana | null>(
    null
  );

  const cells = getVentanaCells(ventana);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const seleccionarVentana = (ventana: Ventana) => {
    guardarVentanaActual(ventana);
    ventanaActual(ventana._id);
  };

  const handleEliminarVentana = (ventana: Ventana) => {
    setVentanaAEliminar(ventana);
    setDeleteModalOpen(true);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableBody>
            <StyledTableRow>
              {cells.map((cell, index) => (
                <StyledTableCell
                  key={index}
                  align='left'
                  style={{ width: cell.width, padding: '7px' }}
                >
                  {cell.id === 'descripcion' ? (
                    <>
                      <div
                        className={`${styles.description} ${
                          isExpanded ? styles.expanded : styles.collapsed
                        }`}
                      >
                        {cell.content}
                      </div>
                      <span
                        className={styles.toggleButton}
                        onClick={handleExpandClick}
                      >
                        {isExpanded ? (
                          <>
                            <span>Ver Menos</span>
                            <FontAwesomeIcon icon={faChevronUp} />
                          </>
                        ) : (
                          <>
                            <span>Ver Más</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                          </>
                        )}
                      </span>
                    </>
                  ) : (
                    cell.content
                  )}
                </StyledTableCell>
              ))}
              <StyledTableCell
                align='left'
                style={{ width: '9.444%', padding: '2px' }}
              >
                <div className={styles.actions}>
                  <button
                    type='button'
                    className={styles.buttonComment}
                    onClick={() => {
                      seleccionarVentana(ventana);
                      handleShow();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faComment}
                      style={{ color: '#ffffff' }}
                    />
                  </button>
                  <button
                    type='button'
                    className={styles.buttonModal}
                    onClick={() => {
                      seleccionarVentana(ventana);
                      openModal();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ color: '#ffffff' }}
                    />
                  </button>
                  <button
                    type='button'
                    className={styles.buttonBorrar}
                    onClick={() => handleEliminarVentana(ventana)} // Cambiado aquí
                  >
                    X
                  </button>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Toaster />
      {isDeleteModalOpen && (
        <ModalDelete
          onClick={() => {
            if (ventanaAEliminar) {
              eliminarVentana(ventanaAEliminar._id);
            }
            setDeleteModalOpen(false);
          }}
          close={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
}

export default VentanaIndividual;
