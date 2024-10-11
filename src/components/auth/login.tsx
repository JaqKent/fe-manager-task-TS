/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import AlertaContext from '~contexts/alert/AlertContext';
import { useAuthContext } from '~contexts/auth/AuthContext';

import styles from './styles.module.scss';

interface UsuarioState {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();

  const alertaContext = useContext(AlertaContext);
  const { alerta, mostrarAlerta } = alertaContext;

  const { mensaje, isAuthenticated, login, verificarUsuarioAutenticado } =
    useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioState>({
    email: '',
    password: '',
  });

  useEffect(() => {
    verificarUsuarioAutenticado();

    if (isAuthenticated) {
      navigate('/weeks');
    }

    if (mensaje) {
      mostrarAlerta(mensaje.mensaje, mensaje.categoria);
      setUsuario({ email: '', password: '' });
    }
  }, [
    mensaje,
    isAuthenticated,
    navigate,
    verificarUsuarioAutenticado,
    mostrarAlerta,
  ]);

  const { email, password } = usuario;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      mostrarAlerta('Todos los campos son obligatorios', 'alerta-error');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      mostrarAlerta(
        'El password debe ser de al menos 6 caracteres',
        'alerta-error'
      );
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 300000);

    login(email, password)
      .then(() => {
        setIsSubmitting(false);
        setUsuario({ email: '', password: '' });
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className={styles.formLogin}>
      {alerta && (
        <div className={`${styles.alerta} ${alerta.categoria}`}>
          {' '}
          {alerta.msg}{' '}
        </div>
      )}
      <div className={styles.formContainer}>
        <h1>Iniciar sesión</h1>
        <form onSubmit={onSubmit}>
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
          <div className='d-grid gap-2 campo-form'>
            {isSubmitting ? (
              <button
                type='button'
                disabled
                className='btn btn-outline-primary btn-lg'
              >
                Iniciando sesión por favor aguarde un momento... <Spinner />
              </button>
            ) : (
              <button type='submit' className='btn btn-outline-primary btn-lg'>
                Iniciar Sesión
              </button>
            )}
          </div>
        </form>
        <Link to='/nueva-cuenta' className={styles.newAccount}>
          Crear Cuenta
        </Link>
      </div>
    </div>
  );
}

export default Login;
