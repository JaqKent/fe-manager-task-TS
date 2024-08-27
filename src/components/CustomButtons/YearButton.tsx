/* eslint-disable react/require-default-props */

interface YearButtonProps {
  year: string;
  onClick: (year: string) => void;
  className?: string; // className es opcional
}

function YearButton({ year, onClick, className }: YearButtonProps) {
  return (
    <button type='button' className={className} onClick={() => onClick(year)}>
      {year}
    </button>
  );
}

export default YearButton;
