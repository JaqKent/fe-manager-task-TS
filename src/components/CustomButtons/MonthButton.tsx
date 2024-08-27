interface MonthButtonIncidenciaProps {
  month: any;
  onClick: (month: string) => void;
  className?: string;
}

function MonthButtonIncidencia({
  month,
  onClick,
  className,
}: MonthButtonIncidenciaProps) {
  return (
    <button type='button' className={className} onClick={() => onClick(month)}>
      {month}
    </button>
  );
}

export default MonthButtonIncidencia;

MonthButtonIncidencia.defaultProps = {
  className: '',
};
