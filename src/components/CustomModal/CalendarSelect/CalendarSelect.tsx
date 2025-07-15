/* eslint-disable no-underscore-dangle */
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';
import { Semana } from 'Interfaces/Semana';

interface SemanaCalendarSelectorProps {
  semanasOptions: Semana[];
  onSemanaSelect: (semanaId: string) => void;
}

function SemanaCalendarSelector({
  semanasOptions,
  onSemanaSelect,
}: SemanaCalendarSelectorProps) {
  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;

    const selectedTime = date.toDate().getTime();

    const semanaEncontrada = semanasOptions.find((sem) => {
      const start = new Date(sem.startDate).getTime();
      const end = new Date(sem.endDate).getTime();
      return selectedTime >= start && selectedTime <= end;
    });

    if (semanaEncontrada) {
      onSemanaSelect(semanaEncontrada._id);
    }
  };

  return (
    <DateCalendar
      onChange={handleDateChange}
      views={['day']}
      disableFuture={false}
    />
  );
}
export default SemanaCalendarSelector;
