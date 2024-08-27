/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
/* import BranchsTable from '../branch/BranchsTable' */
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import clienteAxios from '../../../config/axios';

import styles from './styles.module.scss';

function LegacyBranch() {
  const [branchesOld, setBranchesold] = useState();

  useEffect(() => {
    getLb();
    console.log('branchesOld: ', branchesOld);
  }, []);

  const getLb = async () => {
    const data = await clienteAxios.get('/api/legacyBranch');
    const query = data.data;
    setBranchesold(query);
  };

  const history = useNavigate();

  const backHome = () => {
    history('/weeks');
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
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      <header className={styles.container} />
      <br />
      {branchesOld ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    className={style.tituloTable}
                    style={{ width: '8%' }}
                  >
                    Proyecto
                  </StyledTableCell>
                  <StyledTableCell
                    align='left'
                    className={style.tituloTable}
                    style={{ width: '5%' }}
                  >
                    Usuario Creador
                  </StyledTableCell>
                  <StyledTableCell
                    align='left'
                    className={style.tituloTable}
                    style={{ width: '5%' }}
                  >
                    Nº de Sprint
                  </StyledTableCell>
                  <StyledTableCell
                    align='left'
                    className={style.tituloTable}
                    style={{ width: '20%' }}
                  >
                    Nombre del Branch
                  </StyledTableCell>
                  <StyledTableCell
                    align='left'
                    className={style.tituloTable}
                    style={{ width: '7%' }}
                  >
                    Funcionalidad
                  </StyledTableCell>
                  <StyledTableCell
                    align='left'
                    className={style.tituloTable}
                    style={{ width: '7%' }}
                  >
                    Estado Branch
                  </StyledTableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
          {branchesOld.map((branch) => (
            <CSSTransition
              key={branch._id}
              timeout={{
                appear: 500,
                enter: 300,
                exit: 500,
              }}
              className={styles.tarea}
            >
              {/*    <BranchsTable
                                        branch={branch}
                                    /> */}
            </CSSTransition>
          ))}
        </>
      ) : (
        <div className={styles.center}>
          <h1 className={styles.text}>Cargando...</h1>
          <button type='button' onClick={backHome} className={styles.button}>
            Volver a la Home Page
          </button>
        </div>
      )}
    </>
  );
}

export default LegacyBranch;
