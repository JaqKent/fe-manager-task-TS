/* eslint-disable import/extensions */
/* eslint-disable react/require-default-props */

import { capitalizeText } from '~utils/handleText';

import styles from './styles.module.scss';

// Definición de la interfaz para los props
interface FilterDropdownProps {
  options: string[];
  handleSelect: (value: string) => void;
  value: string;
  selected?: string;
  saveLocal?: boolean;
}

function FilterDropdown({
  options,
  handleSelect,
  value,
  selected,
  saveLocal,
}: FilterDropdownProps) {
  return (
    <div className='mb-2 my-2 my-md-0'>
      <select
        className={styles.filterContainer}
        value={value}
        onChange={(e) => {
          handleSelect(e.target.value);
          if (saveLocal) {
            localStorage.setItem('noteStatus', e.target.value);
          }
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {capitalizeText(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterDropdown;
