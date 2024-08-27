/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/extensions */
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AlertaContext } from '~contexts/alert/AlertContext';
import { useAuthContext } from '~contexts/auth/AuthContext';

import styles from './styles.module.scss';

function NuevaCuenta() {
  const alertaContext = useContext(AlertaContext);
  const { alerta, mostrarAlerta } = alertaContext;

  const {
    mensaje,
    verificarUsuarioAutenticado,
    resetStateMsg,
    isAuthenticated,
    register,
  } = useAuthContext();

  const navigate = useNavigate();

  // useEffect que valida autenticación, registro duplicado, o login
  useEffect(() => {
    verificarUsuarioAutenticado();
    resetStateMsg();
    if (isAuthenticated) navigate('/');

    if (mensaje) {
      mostrarAlerta(mensaje.mensaje, mensaje.categoria);

      if (mensaje.mensaje === 'Usuario Creado!!!') {
        mostrarAlerta(mensaje.mensaje, mensaje.categoria);
        navigate('/');
      }
    }
  }, [mensaje, isAuthenticated, navigate]);

  // State para iniciar registro
  const [usuario, guardarUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
  });

  // Extraer email y password de usuario
  const { nombre, email, password, confirmar } = usuario;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    guardarUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  // Registrar usuario
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar que no tengamos campos vacíos
    if (
      nombre.trim() === '' ||
      email.trim() === '' ||
      password.trim() === '' ||
      confirmar.trim() === ''
    ) {
      mostrarAlerta('Todos los campos son obligatorios', 'alerta-error');
      return;
    }

    // Campo o state password mínimo de 6 caracteres
    if (password.length < 6) {
      mostrarAlerta(
        'El password debe ser de al menos 6 caracteres',
        'alerta-error'
      );
      return;
    }

    // Revisar que sean iguales
    if (password !== confirmar) {
      mostrarAlerta('El password no son iguales', 'alerta-error');
      return;
    }

    register(nombre, email, password);

    guardarUsuario({
      nombre: '',
      email: '',
      password: '',
      confirmar: '',
    });

    // usuarioAutenticado();
  };

  return (
    <div className={styles.formLogin}>
      {alerta ? (
        <div className={`${styles.alerta} ${alerta.categoria}`}>
          {' '}
          {alerta.msg}{' '}
        </div>
      ) : null}
      <div className={styles.formContainer}>
        <h1>Crear Cuenta</h1>
        <form onSubmit={onSubmit}>
          <div className={styles.campoForm}>
            <label htmlFor='nombre'>Nombre</label>
            <input
              type='text'
              name='nombre'
              placeholder='Tu Nombre'
              onChange={onChange}
              value={nombre}
            />
          </div>
          <div className={styles.campoForm}>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              placeholder='Tu Email'
              onChange={onChange}
              value={email}
            />
          </div>
          <div className={styles.campoForm}>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Tu Password'
              onChange={onChange}
              value={password}
            />
          </div>
          <div className={styles.campoForm}>
            <label htmlFor='confirmar'>Confirmar Password</label>
            <input
              type='password'
              name='confirmar'
              placeholder='Repetir Password'
              onChange={onChange}
              value={confirmar}
            />
          </div>
          <div className='d-grid gap-2 campo-form'>
            <button
              type='submit'
              className='btn btn-outline-primary btn-lg'
              value='Iniciar Sesión'
            >
              Registrarme
            </button>
          </div>
        </form>
        <Link to='/' className={styles.newAccount}>
          Ya tienes una cuenta? Login
        </Link>
      </div>
    </div>
  );
}

export default NuevaCuenta;
