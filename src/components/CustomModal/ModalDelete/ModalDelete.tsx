import styles from './styles.module.scss';

interface Props {
  onClick: () => void;
  close: () => void;
}

function ModalDelete({ onClick, close }: Props) {
  return (
    <div className={styles.modal}>
      <div>¿Está seguro que desea eliminar el ítem?</div>
      <button onClick={onClick} type='button' className={styles.buttonYes}>
        Sí
      </button>
      <button onClick={close} type='button' className={styles.buttonNo}>
        No
      </button>
    </div>
  );
}

export default ModalDelete;
