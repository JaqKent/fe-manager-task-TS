/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, ReactNode, useContext, useState } from 'react';
import { CommentIncidencia } from 'Interfaces/CommentsIncidencias';

import clienteAxios from '../../config/axios';

interface CommentIncidenciaContextProps {
  commentIncidencias: CommentIncidencia[];
  currentComment: CommentIncidencia | null;
  mensaje: string | null;
  obtenerComments: (incidenciaId: string) => void;
  agregarComment: (comment: CommentIncidencia) => Promise<void>;
  eliminarComment: (commentId: string) => void;
  setCommentActual: (comment: CommentIncidencia) => void;
  limpiarComment: () => void;
  limpiarComments: () => void;
}

const CommentIncidenciaContext = createContext<
  CommentIncidenciaContextProps | undefined
>(undefined);

export const useCommentIncidenciaContext = () => {
  const context = useContext(CommentIncidenciaContext);
  if (!context) {
    throw new Error(
      'useCommentIncidenciaContext debe ser usado dentro de un CommentIncidenciaProvider'
    );
  }
  return context;
};

export default function CommentIncidenciaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [commentIncidencias, setCommentIncidencias] = useState<
    CommentIncidencia[]
  >([]);
  const [currentComment, setCurrentComment] =
    useState<CommentIncidencia | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const obtenerComments = async (incidenciaId: string) => {
    try {
      const response = await clienteAxios.get(
        `/commentsIncidencia/${incidenciaId}`
      );
      setCommentIncidencias(response.data);
    } catch (error) {
      setMensaje('Hubo un error al obtener los comentarios');
    }
  };

  const agregarComment = async (comment: CommentIncidencia) => {
    try {
      console.log('Valor de comment.incidencias:', comment.incidencias);
      const response = await clienteAxios.post(
        `/commentsIncidencia/${comment.incidencias}`,
        comment
      );
      setCommentIncidencias([
        ...commentIncidencias,
        response.data.commentNuevo,
      ]);
    } catch (error) {
      setMensaje('Hubo un error al agregar el comentario');
    }
  };

  const eliminarComment = async (commentId: string) => {
    try {
      await clienteAxios.delete(`/commentsIncidencia/${commentId}`);
      setCommentIncidencias(
        commentIncidencias.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      setMensaje('Hubo un error al eliminar el comentario');
    }
  };

  const setCommentActual = (comment: CommentIncidencia) => {
    setCurrentComment(comment);
  };

  const limpiarComment = () => {
    setCurrentComment(null);
  };
  const limpiarComments = () => {
    setCommentIncidencias([]);
  };

  const contextValue: CommentIncidenciaContextProps = {
    commentIncidencias,
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
    <CommentIncidenciaContext.Provider value={contextValue}>
      {children}
    </CommentIncidenciaContext.Provider>
  );
}
