/* eslint-disable import/extensions */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import { useNoteContext } from '~contexts/Notes/Notes';

import ModalContent from '../NotesModal/Modal';

// Definición de tipos para las props
interface DropdownNoteProps {
  options?: string[];
  updateNote?: (noteId: string, updateData: object) => void;
  noteId?: string;
  status?: string;
  setIsShowModal: (show: boolean) => void;
}

function DropdownNote({
  options = ['active', 'completed'],
  updateNote,
  noteId,
  status,
  setIsShowModal,
}: DropdownNoteProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteNote } = useNoteContext();

  const handleSelect = (eventKey: string) => {
    const isActive = eventKey === 'active';

    if (updateNote && noteId) {
      updateNote(noteId, { active: isActive }, 'update');
    }
  };

  return (
    <>
      <ModalContent
        isConfirmModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        title='Delete Note'
        successMsg="Are you sure? You won't be able to recover this note."
        btnConfirmText='Confirm'
        btnCancelText='Cancel'
        onCancel={() => {
          setIsShowModal(false);
          setShowDeleteModal(false);
        }}
        onConfirm={() => {
          if (noteId) {
            deleteNote(noteId, 'delete');
          }
          setIsShowModal(false);
        }}
      />
      <div className='d-flex justify-content-end align-items-center'>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle className='note_header_dropdown note_dropdown_list'>
            ...
            <Dropdown.Menu className='note_header_dropdown_menu'>
              {options.map((option, index) => (
                <Dropdown.Item key={index} eventKey={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Toggle>
        </Dropdown>
        <span
          onClick={() => {
            setIsShowModal(true);
            setShowDeleteModal(true);
          }}
          className='button remove'
        >
          X
        </span>
      </div>
    </>
  );
}

export default DropdownNote;
