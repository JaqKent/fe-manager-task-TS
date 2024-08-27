/* eslint-disable react/require-default-props */
import { Button, Modal } from 'react-bootstrap';

interface ModalContentProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  successMsg: string;
  isConfirmModal?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  btnConfirmText?: string;
  btnCancelText?: string;
}

function ModalContent({
  show,
  handleClose,
  title,
  successMsg,
  isConfirmModal = false,
  onCancel,
  onConfirm,
  btnConfirmText = 'Confirm',
  btnCancelText = 'Cancel',
}: ModalContentProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{successMsg}</Modal.Body>
      {isConfirmModal && (
        <Modal.Footer>
          <Button onClick={onCancel} variant='secondary'>
            {btnCancelText}
          </Button>
          <Button onClick={onConfirm} variant='primary'>
            {btnConfirmText}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default ModalContent;
