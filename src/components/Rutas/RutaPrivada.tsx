/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
/* eslint-disable import/extensions */
import { Spinner } from 'react-bootstrap';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '~contexts/auth/AuthContext';

interface RutaPrivadaProps {
  children?: JSX.Element;
}

function RutaPrivada({ children }: RutaPrivadaProps) {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) return <Spinner />;

  return isAuthenticated ? children || <Outlet /> : <Navigate to='/' />;
}

export default RutaPrivada;
