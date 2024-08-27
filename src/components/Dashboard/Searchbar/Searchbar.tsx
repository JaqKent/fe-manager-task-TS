/* eslint-disable jsx-a11y/control-has-associated-label */
import { RiSearchLine as SearchIcon } from 'react-icons/ri';

import styles from './styles.module.scss';

interface SearchbarProps {
  searchTerm: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Searchbar({ searchTerm, handleChange }: SearchbarProps) {
  return (
    <div className='wrap mb-2 my-2 my-md-0'>
      <div className={styles.search}>
        <input
          onChange={handleChange}
          type='text'
          className={styles.searchTerm}
          placeholder='Search...'
          name='term'
          value={searchTerm}
          maxLength={50}
        />
        <button type='button' className={styles.searchButton} disabled>
          <SearchIcon size='1.3rem' color='white' className='mb-1' />
        </button>
      </div>
    </div>
  );
}

export default Searchbar;
