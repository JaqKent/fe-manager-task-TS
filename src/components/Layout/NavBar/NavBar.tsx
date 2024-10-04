/* eslint-disable import/extensions */
import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuthContext } from '~contexts/auth/AuthContext';

import Reminder from '../Reminder/Reminder';
import SearchBar from '../Searchbar/SearchBar';

function CustomNavbar() {
  // Extraer la información de autenticación

  const { logout } = useAuthContext();
  const [mostrarRecordatorio, setMostrarRecordatorio] = useState(false);
  const history = useNavigate();

  const logOut = () => {
    logout();
    history('/');
  };

  const modalReminder = () => {
    setMostrarRecordatorio(!mostrarRecordatorio);
  };

  return (
    <Navbar
      expand='xl'
      className='bg-body-tertiary  fixed-top '
      data-bs-theme='dark'
      style={{ height: '80px', padding: '20px' }}
    >
      <Navbar.Brand className='navBar ' style={{ padding: '0 60px 0 0' }}>
        <h1>Task Manager</h1>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav ' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='me-auto' style={{ gap: '10px ', fontSize: '15px' }}>
          <Nav.Link as={NavLink} to='/weeks'>
            Ventanas de Trabajo
          </Nav.Link>
          <NavDropdown title='Incidencias' id='basic-nav-dropdown'>
            <NavDropdown.Item as={NavLink} to='/incidencias'>
              Incidencias Activas
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to='/cerrado-incidencias'>
              Incidencias Cerradas
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link as={NavLink} to='/LegacyBranch'>
            Old Ventanas/INC
          </Nav.Link>
          <Nav.Link as={NavLink} to='/backlog-ventanas'>
            Backlog
          </Nav.Link>
          <NavDropdown title='Informes' id='basic-nav-dropdown'>
            <NavDropdown.Item as={NavLink} to='/informesHome'>
              Dashboard
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to='/informeIncidencias'>
              Informe Incidencias
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to='/InformeVentanas'>
              Informe Ventanas
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link
            onClick={() => {
              modalReminder();
            }}
          >
            Ventanas Proximas
          </Nav.Link>
        </Nav>

        <Reminder
          mostrarRecordatorio={mostrarRecordatorio}
          setMostrarRecordatorio={setMostrarRecordatorio}
        />
      </Navbar.Collapse>
      <Nav className='nav-principal'>
        <Nav.Link onClick={logOut}>Cerrar Sesión</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default CustomNavbar;
