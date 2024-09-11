/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */

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
import { Ventana } from 'Interfaces/ventana';

import { getVentanaCells } from '~constants/constants';
import { useVentanaContext } from '~contexts/Ventana/Ventana';

import styles from './styles.module.scss';

// Estilos compartidos
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
  const { eliminarVentana, guardarVentanaActual, cargarVentanaParaEdicion } =
    useVentanaContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const cells = getVentanaCells(ventana);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEliminarVentana = () => {
    eliminarVentana(ventana._id);
  };

  const seleccionarVentana = () => {
    guardarVentanaActual(ventana);
    cargarVentanaParaEdicion(ventana);
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
                      seleccionarVentana();
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
                      seleccionarVentana();
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
                    onClick={handleEliminarVentana}
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
    </>
  );
}

export default VentanaIndividual;
