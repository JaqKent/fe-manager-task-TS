/* eslint-disable react/require-default-props */
import { Button } from 'react-bootstrap';
import { IoMdAdd as AddIcon } from 'react-icons/io';

interface ButtonNotesProps {
  id?: string;
  loading: boolean;
  addNote: () => void; // No se necesita argumento aquí
  filter: (value: string) => void;
  filterValue: string;
}

function ButtonNotes({
  id,
  loading,
  addNote,
  filter,
  filterValue,
}: ButtonNotesProps) {
  return (
    <Button
      id={id}
      className='addButton button-tooltip add-note bg-info mb-2 my-2 my-md-0'
      disabled={loading}
      onClick={() => {
        addNote();

        filter(filterValue === 'active' ? 'active' : 'all');
      }}
    >
      {!loading ? (
        <AddIcon size='1.5rem' color='white' />
      ) : (
        <span className='spinner-grow spinner-grow-sm' />
      )}
    </Button>
  );
}

export default ButtonNotes;
