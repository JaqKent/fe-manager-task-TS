/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
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
import { Incidencia } from 'Interfaces/Incidencias';

import { getIncidenciaCells } from '~constants/constants';
import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';

import styles from './styles.module.scss';

interface Props {
  incidencia: Incidencia;
  openModal: () => void;
  handleShow: () => void;
}

function DataIncidencias({ incidencia, openModal, handleShow }: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { guardarIncidenciaActual } = useIncidenciaContext();

  const cells = getIncidenciaCells(incidencia);

  const seleccionarIncidencia = () => {
    guardarIncidenciaActual(incidencia);
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label='customized table'>
        <TableBody>
          <StyledTableRow>
            {cells.map((cell, index) => (
              <StyledTableCell
                key={index}
                align='left'
                style={{ width: cell.width, padding: '7px ' }}
              >
                {cell.id === 'descripcion' ? (
                  <>
                    <div
                      className={`${styles.description} ${
                        isExpanded ? styles.expanded : styles.collapsed
                      }`}
                    >
                      {cell.value}
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
                  cell.value
                )}
              </StyledTableCell>
            ))}
            <StyledTableCell
              align='left'
              style={{ width: '13.33%', padding: '7px ' }}
            >
              <div className={styles.actions}>
                <button
                  type='button'
                  className={styles.buttonComment}
                  onClick={() => {
                    seleccionarIncidencia();
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
                    seleccionarIncidencia();
                    openModal();
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    style={{ color: '#ffffff' }}
                  />
                </button>
              </div>
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataIncidencias;
