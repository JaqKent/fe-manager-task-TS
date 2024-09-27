import { useEffect, useState } from 'react';
import {
  Collapse,
  FormControl,
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Semana } from 'Interfaces/Semana';

interface DropdownSemanaProps {
  semanasOptions: Semana[];
  selectedSemana: string;
  handleSemanaChange: (event: SelectChangeEvent<string>) => void;
}

function DropdownSemana({
  semanasOptions,
  selectedSemana,
  handleSemanaChange,
}: DropdownSemanaProps) {
  const [semanasAgrupadas, setSemanasAgrupadas] = useState<{
    [mes: string]: Semana[];
  }>({});
  const [openMes, setOpenMes] = useState<{ [mes: string]: boolean }>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const agruparSemanasPorMes = (semanas: Semana[]) => {
      const agrupadas: { [key: string]: Semana[] } = {};
      semanas.forEach((semana) => {
        const mes = new Date(semana.startDate).toLocaleString('default', {
          month: 'long',
        });
        if (!agrupadas[mes]) {
          agrupadas[mes] = [];
        }
        agrupadas[mes].push(semana);
      });
      return agrupadas;
    };

    const agrupadas = agruparSemanasPorMes(semanasOptions);
    setSemanasAgrupadas(agrupadas);
  }, [semanasOptions]);

  const formatDate = (date: string): string => {
    const validDate = new Date(date);
    return isNaN(validDate.getTime())
      ? 'Fecha Inválida'
      : validDate.toLocaleDateString();
  };

  return (
    <FormControl style={{ width: '250px' }}>
      <Select
        value={selectedSemana || ''}
        onChange={(event) => {
          handleSemanaChange(event);
          setOpenMes({});
          setDropdownOpen(false);
        }}
        onOpen={() => setDropdownOpen(true)}
        onClose={() => setDropdownOpen(false)}
        open={dropdownOpen}
        displayEmpty
        renderValue={(selected) => {
          if (selected) {
            const semanaSeleccionada = semanasOptions.find(
              (semana) => semana._id === selected
            );
            return semanaSeleccionada
              ? `${formatDate(semanaSeleccionada.startDate)} - ${formatDate(semanaSeleccionada.endDate)}`
              : 'Seleccione una semana';
          }
          return 'Seleccione una semana';
        }}
      >
        {Object.entries(semanasAgrupadas).map(([mes, semanas]) => (
          <div key={mes}>
            <MenuItem
              onClick={() =>
                setOpenMes((prev) => ({ ...prev, [mes]: !prev[mes] }))
              }
            >
              {mes}
            </MenuItem>
            <Collapse in={openMes[mes]} timeout='auto' unmountOnExit>
              <List component='div' disablePadding>
                {semanas.map((semana) => (
                  <MenuItem
                    key={semana._id}
                    value={semana._id}
                    onClick={() => {
                      handleSemanaChange({
                        target: { value: semana._id },
                      } as SelectChangeEvent<string>);
                      setOpenMes({});
                      setDropdownOpen(false);
                    }}
                  >
                    {`${formatDate(semana.startDate)} - ${formatDate(semana.endDate)}`}
                  </MenuItem>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </Select>
    </FormControl>
  );
}

export default DropdownSemana;
