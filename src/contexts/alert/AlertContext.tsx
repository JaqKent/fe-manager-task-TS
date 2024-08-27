/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, ReactNode, useContext, useState } from 'react';

interface Alerta {
  msg: string;
  categoria: string;
}

interface AlertaContextProps {
  alerta: Alerta | null;
  mostrarAlerta: (msg: string, categoria: string) => void;
  ocultarAlerta: () => void;
}

export const AlertaContext = createContext<AlertaContextProps>({
  alerta: null,
  mostrarAlerta: () => {},
  ocultarAlerta: () => {},
});

export const useAlerta = () => {
  const context = useContext(AlertaContext);
  if (!context) {
    throw new Error('useAlerta debe ser usado dentro de un AlertaProvider');
  }
  return context;
};

export function AlertaProvider({ children }: { children: ReactNode }) {
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  function mostrarAlerta(msg: string, categoria: string) {
    setAlerta({ msg, categoria });
    setTimeout(() => {
      setAlerta(null);
    }, 5000);
  }

  function ocultarAlerta() {
    setAlerta(null);
  }

  const contextValue: AlertaContextProps = {
    alerta,
    mostrarAlerta,
    ocultarAlerta,
  };

  return (
    <AlertaContext.Provider value={contextValue}>
      {children}
    </AlertaContext.Provider>
  );
}

export default AlertaContext;
