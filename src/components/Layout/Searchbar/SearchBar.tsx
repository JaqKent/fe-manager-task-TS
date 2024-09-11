/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react';

import { useIncidenciaContext } from '~contexts/incidencias/Incidencias';
import { useSemanaContext } from '~contexts/Semana/Semana';
import { useVentanaContext } from '~contexts/Ventana/Ventana';

interface SearchResult {
  id: string;
  description: string;
  year: number;
  month: string;
  type: 'Incidencia' | 'Ventana';
}

function SearchBar() {
  const { incidencias, obtenerIncidencias, incidenciaActual } =
    useIncidenciaContext();
  const {
    todasLasVentanas,
    obtenerTodasLasVentanas,
    guardarVentanaActual,
    setSemanaSeleccionada,
    obtenerVentana,
  } = useVentanaContext();
  const { semanas, obtenerSemanas } = useSemanaContext();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      await obtenerIncidencias();
      await obtenerSemanas();
      await obtenerTodasLasVentanas();
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar datos. Inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoad.current) {
      fetchData();
      initialLoad.current = true;
    }
  }, [obtenerIncidencias, obtenerSemanas, obtenerTodasLasVentanas]);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.length === 0) {
        setResults([]);
        return;
      }

      const semanaMap = new Map(semanas.map((semana) => [semana._id, semana]));

      // Filtrado de incidencias
      const filteredIncidencias = incidencias
        .filter(
          (incidencia) =>
            incidencia.descripcion &&
            incidencia.descripcion
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
        .map((incidencia) => ({
          id: incidencia._id,
          description: incidencia.descripcion || '',
          year: incidencia.year,
          month: incidencia.month,
          type: 'Incidencia' as const,
        }));

      // Filtrado de ventanas
      const filteredVentanas = todasLasVentanas
        .filter(
          (ventana) =>
            ventana.descripcion &&
            ventana.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((ventana) => {
          const semana = semanaMap.get(ventana.semana);
          return {
            id: ventana._id,
            description: ventana.descripcion || '',
            year: semana
              ? new Date(semana.startDate).getFullYear()
              : 'Desconocido',
            month: semana
              ? new Date(semana.startDate).toLocaleString('default', {
                  month: 'long',
                })
              : 'Desconocido',
            type: 'Ventana' as const,
          };
        });

      console.log('Filtered Incidencias:', filteredIncidencias);
      console.log('Filtered Ventanas:', filteredVentanas);

      setResults([...filteredIncidencias, ...filteredVentanas]);
    };

    handleSearch();
  }, [searchTerm, incidencias, todasLasVentanas, semanas]);

  const handleSelect = async (result: SearchResult) => {
    if (result.type === 'Incidencia') {
      incidenciaActual(result.id);
    } else if (result.type === 'Ventana') {
      const ventana = todasLasVentanas.find((v) => v._id === result.id);
      if (ventana) {
        await obtenerVentana(ventana.semana, result.id);
        guardarVentanaActual(ventana);
        // Actualiza la semana seleccionada en el contexto
        setSemanaSeleccionada(ventana.semana);
      } else {
        console.error('Ventana no encontrada.');
      }
      setIsOpen(false); // Cierra el menú de búsqueda después de seleccionar
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}
    >
      <input
        type='text'
        placeholder='Buscar incidencias o ventanas...'
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: '#fff',
          color: '#000',
        }}
      />
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isOpen && results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            listStyle: 'none',
            padding: 0,
            border: '1px solid #ddd',
            zIndex: 10,
          }}
        >
          {results.map((result) => (
            <li
              key={result.id}
              onClick={() => handleSelect(result)}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {result.description} ({result.year}, {result.month}) {result.type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
