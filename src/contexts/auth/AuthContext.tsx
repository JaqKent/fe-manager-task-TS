/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/token';

interface User {
  _id: string;
  length: number;
  id: string;
  name: string;
  email: string;
}

interface Mensaje {
  mensaje: string;
  categoria: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  verificarUsuarioAutenticado: () => void;
  resetStateMsg: () => void;
  mensaje: Mensaje | null;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  verificarUsuarioAutenticado: () => {},
  resetStateMsg: () => {},
  mensaje: null,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);

  const verificarUsuarioAutenticado = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      tokenAuth(token);
      try {
        const response = await clienteAxios.get('/usuario');
        const userData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setUser(userData); // Establece el usuario
        setIsAuthenticated(true);
      } catch (error: any) {
        setError('Error al obtener usuario');
        console.error(
          'Error al obtener usuario',
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    verificarUsuarioAutenticado();
  }, [verificarUsuarioAutenticado]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await clienteAxios.post('/auth', { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      tokenAuth(response.data.token);
      setUser(response.data.usuario);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError('Error al iniciar sesión');
      console.error(
        'Error al iniciar sesión',
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const register = useCallback(
    async (nombre: string, email: string, password: string) => {
      try {
        setIsLoading(true);
        const response = await clienteAxios.post('/usuario', {
          nombre,
          email,
          password,
        });
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        tokenAuth(response.data.token);
        setUser(response.data.usuario);
        setIsAuthenticated(true);
      } catch (error: any) {
        setError('Error al registrar usuario');
        if (error.response) {
          console.error('Error al registrar usuario:', error.response.data);
        } else {
          console.error('Error al registrar usuario:', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetStateMsg = useCallback(() => {
    setMensaje(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      register,
      verificarUsuarioAutenticado,
      resetStateMsg,
      mensaje,
    }),
    [user, isAuthenticated, isLoading, error, mensaje]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
