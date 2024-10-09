/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import {
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CommentIncidencia } from 'Interfaces/CommentsIncidencias';
import { CommentVentana } from 'Interfaces/CommentVentana';

import ModalDelete from '~components/CustomModal/ModalDelete/ModalDelete';
import { createSpeechRecognitionUtils } from '~utils/VoiceRecognition';

import styles from './styles.module.scss';

interface UpdateModalProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (formData: Record<string, any>) => void;
  title: string;
  data: CommentIncidencia[] | CommentVentana[];
  handleDeleteUpdate: (commentId: string) => Promise<void>;
}

function UpdateModal({
  show,
  handleClose,
  handleSubmit,
  title,
  data,
  handleDeleteUpdate,
}: UpdateModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noComments, setNoComments] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>({
    x: 350,
    y: 100,
  });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isListening, setIsListening] = useState<boolean>(false);

  const { startRecognition, stopRecognition, onResult, onError } =
    createSpeechRecognitionUtils();

  useEffect(() => {
    onResult((transcript) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        update: `${prevFormData.update || ''} ${transcript}`,
      }));
    });

    onError((error) => {
      console.error('SpeechRecognition error:', error);
    });
  }, [onResult, onError]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!dragStart) return;
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        const clampedX = Math.max(0, Math.min(newX, window.innerWidth - 300));
        const clampedY = Math.max(0, Math.min(newY, window.innerHeight - 300));

        setModalPosition({ x: clampedX, y: clampedY });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (show) {
      setIsLoading(true);
      setNoComments(false);

      const timer = setTimeout(() => {
        if (isLoading) {
          if (data.length === 0) {
            setNoComments(true);
          }
          setIsLoading(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [show, data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const formatFecha = (fecha?: Date) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear().toString();
    return `${dia}-${mes}-${anio}`;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(formData);
    setFormData({});
  };

  const handleDelete = async (commentId: string) => {
    try {
      setCommentLoading(true);
      await handleDeleteUpdate(commentId);
    } catch (error) {
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleConfirmDelete = async (commentId: string) => {
    await handleDelete(commentId);
    setOpenDelete(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y,
    });
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
    setIsListening(!isListening);
  };

  return show ? (
    <div
      style={{
        position: 'fixed',
        top: modalPosition.y,
        left: modalPosition.x,
        cursor: isDragging ? 'grabbing' : 'grab',
        fontSize: '14px',
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <div className={styles.modalContainer}>
          <div
            className={styles.modalTitle}
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className={styles.modalDescription}>{title}</div>
            <div className={styles.fechaCerrar}>
              <div className='delete' onClick={handleClose}>
                <div className={styles.cerrarModal}>x</div>
              </div>
            </div>
          </div>
          <div className={styles.commentboxModal}>
            {isLoading ? (
              <Spinner className={styles.spinner} />
            ) : noComments ? (
              <div>No hay comentarios cargados</div>
            ) : (
              data.length > 0 &&
              data.map((comment) => (
                <div className={styles.commentSection} key={comment?._id}>
                  <div className={styles.userModal}>
                    <div>
                      <div>{comment?.usuarioCreador?.nombre}</div>
                      <div className={styles.fecha}>
                        {formatFecha(comment?.fechaCreacion)}
                      </div>
                    </div>
                    <div>
                      <button
                        type='button'
                        onClick={() => {
                          setOpenDelete(true);
                        }}
                        className={styles.cerrarModal}
                      >
                        x
                      </button>
                    </div>
                  </div>
                  <div className={styles.modalCuadroTexto}>
                    <div className={styles.commentUpdate}>
                      {comment?.update}
                    </div>
                  </div>
                  {openDelete && (
                    <ModalDelete
                      onClick={() => handleConfirmDelete(comment._id)}
                      close={() => setOpenDelete(false)}
                    />
                  )}
                </div>
              ))
            )}
          </div>
          <div className={styles.commentTextarea}>
            <div>
              <label>Update:</label>
              <div className={styles.containerArea}>
                <textarea
                  className={styles.modalTextarea}
                  name='update'
                  value={formData.update || ''}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <button
                  type='button'
                  onClick={toggleListening}
                  className={styles.voiceButton}
                >
                  {isListening ? (
                    <FontAwesomeIcon icon={faMicrophoneSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faMicrophone} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <button type='submit' className={styles.buttonUpdate}>
                Agregar Update
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : null;
}

export default UpdateModal;
