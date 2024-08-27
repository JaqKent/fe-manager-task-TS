/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, ReactNode, useContext, useState } from 'react';
import { CommentVentana } from 'Interfaces/CommentVentana';

import clienteAxios from '../../config/axios';

interface CommentVentanaContextProps {
  commentVentanas: CommentVentana[];
  currentComment: CommentVentana | null;
  mensaje: string | null;
  obtenerComments: (ventanaId: string) => void;
  agregarComment: (comment: CommentVentana) => Promise<void>;
  eliminarComment: (commentId: string) => void;
  setCommentActual: (comment: CommentVentana) => void;
  limpiarComment: () => void;
  limpiarComments: () => void;
}

const CommentVentanaContext = createContext<
  CommentVentanaContextProps | undefined
>(undefined);

export const useCommentVentanaContext = () => {
  const context = useContext(CommentVentanaContext);
  if (!context) {
    throw new Error(
      'useCommentVentanaContext debe ser usado dentro de un CommentVentanaProvider'
    );
  }
  return context;
};

export default function CommentVentanaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [commentVentanas, setCommentVentanas] = useState<CommentVentana[]>([]);
  const [currentComment, setCurrentComment] = useState<CommentVentana | null>(
    null
  );
  const [mensaje, setMensaje] = useState<string | null>(null);

  const obtenerComments = async (ventanaId: string) => {
    try {
      console.log('Obteniendo comentarios para ventanaId:', ventanaId);
      const response = await clienteAxios.get(`/commentsVentanas/${ventanaId}`);
      console.log('Comentarios obtenidos:', response.data);
      setCommentVentanas(response.data);
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      setMensaje('Hubo un error al obtener los comentarios');
    }
  };

  const agregarComment = async (comment: CommentVentana) => {
    try {
      console.log('Agregando comentario:', comment);
      const response = await clienteAxios.post(
        `/commentsVentanas/${comment.ventanas}`,
        comment
      );
      console.log('Comentario agregado:', response.data.commentNuevo);
      setCommentVentanas([...commentVentanas, response.data.commentNuevo]);
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      setMensaje('Hubo un error al agregar el comentario');
    }
  };

  const eliminarComment = async (commentId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar el comentario?')) {
      try {
        console.log('Eliminando comentario con ID:', commentId);
        await clienteAxios.delete(`/commentsVentanas/${commentId}`);
        setCommentVentanas(
          commentVentanas.filter((comment) => comment._id !== commentId)
        );
      } catch (error) {
        console.error('Error al eliminar comentario:', error);
        setMensaje('Hubo un error al eliminar el comentario');
      }
    }
  };

  const setCommentActual = (comment: CommentVentana) => {
    setCurrentComment(comment);
  };

  const limpiarComment = () => {
    setCurrentComment(null);
  };

  const limpiarComments = () => {
    setCommentVentanas([]);
  };

  const contextValue: CommentVentanaContextProps = {
    commentVentanas,
    currentComment,
    mensaje,
    obtenerComments,
    agregarComment,
    eliminarComment,
    setCommentActual,
    limpiarComment,
    limpiarComments,
  };

  return (
    <CommentVentanaContext.Provider value={contextValue}>
      {children}
    </CommentVentanaContext.Provider>
  );
}
