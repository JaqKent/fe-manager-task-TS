/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, ReactNode, useContext, useState } from 'react';
import { Notes } from 'Interfaces/Notes';

import clienteAxios from '~config/axios';
import { useAuthContext } from '~contexts/auth/AuthContext';

interface NoteContextProps {
  notes: Notes[];
  noteMsg: boolean;
  loading: boolean;
  hasPhoto: boolean;
  imageOverlay: boolean;
  deleteSuccess: string;
  actualNote: Notes | null;
  copyLink: string;
  post: any;
  isPrivate: boolean;
  pinMessage: string;
  link: any;
  getNotes: () => void;
  addNote: (data: Notes) => Promise<void>;
  updateNote: (
    id: string,
    data: Partial<Notes>,
    typeUpdate: string
  ) => Promise<void>;
  deleteNote: (id: string, typeUpdate: string) => Promise<void>;
  cleanNotes: () => void;
  updateCoordinates: (
    noteId: string,
    coordinates: { ejeX: number; ejeY: number },
    typeUpdate: string
  ) => Promise<void>;
  showImageOverlay: () => void;
  hideImageOverlay: () => void;
  showErrorNote: (msg: string) => void;
  getActualNote: (id: string) => void;
  generateLink: (noteId: string, pin: string) => Promise<void>;
  getLinkInformation: (url: string, pin: string) => Promise<void>;
  updateLink: (id: string, data: any) => Promise<void>;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};

export default function NoteProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [noteMsg, setNoteMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [imageOverlay, setImageOverlay] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [actualNote, setActualNote] = useState<Notes | null>(null);
  const [copyLink, setCopyLink] = useState('');
  const [post, setPost] = useState<any>({});
  const [isPrivate, setIsPrivate] = useState(false);
  const [pinMessage, setPinMessage] = useState('');
  const [link, setLink] = useState<any>({});
  const { user } = useAuthContext();

  const getNotes = async () => {
    try {
      const response = await clienteAxios.get('/notes');

      setNotes(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const addNote = async (note: Notes) => {
    try {
      const response = await clienteAxios.post('/notes', note);
    } catch (error: any) {
      console.error(
        'Error al agregar nota:',
        error.response?.data || error.message
      );
    }
  };

  const updateNote = async (
    id: string,
    data: Partial<Notes>,
    typeUpdate: string
  ) => {
    try {
      const response = await clienteAxios.put(`/notes/${id}`, {
        ...data,
        typeUpdate,
        userId: user?.id,
      });

      setNotes(notes.map((note) => (note._id === id ? response.data : note)));
    } catch (error) {
      console.log('Error updating note:', error.response); // Verifica los errores
    }
  };

  const deleteNote = async (id: string, typeUpdate: string) => {
    try {
      const response = await clienteAxios.put(`/notes/${id}`, {
        typeUpdate,
        userId: user?.id,
      });
      setNotes(notes.filter((note) => note._id !== id));
      setDeleteSuccess(response.data.message);
      setTimeout(() => setDeleteSuccess(''), 3000);
    } catch (error) {
      console.log('Error deleting note:', error.response); // Verifica los errores
    }
  };

  const cleanNotes = () => {
    setNotes([]);
  };

  const updateCoordinates = async (
    noteId: string,
    coordinates: { ejeX: number; ejeY: number },
    typeUpdate: string
  ) => {
    try {
      const response = await clienteAxios.put(`/notes/${noteId}`, {
        ...coordinates,
        typeUpdate,
      });
      setNotes(
        notes.map((note) => (note._id === noteId ? response.data : note))
      );
    } catch (error) {
      setPinMessage('El pin no es correcto');
      setTimeout(() => setPinMessage(''), 2000);
    }
  };

  const showImageOverlay = () => {
    setImageOverlay(true);
  };

  const hideImageOverlay = () => {
    setImageOverlay(false);
  };

  const showErrorNote = (msg: string) => {
    setNoteMsg(true);
    setTimeout(() => setNoteMsg(false), 3000);
  };

  const getActualNote = (id: string) => {
    setActualNote(notes.find((note) => note._id === id) || null);
  };

  const generateLink = async (noteId: string, pin: string) => {
    try {
      if (noteId) {
        const response = await clienteAxios.post('/link', { noteId, pin });
        setCopyLink(response.data.data);
      }
    } catch (error) {
      console.log('Error generating link:', error.response); // Verifica los errores
    }
  };

  const getLinkInformation = async (url: string, pin: string) => {
    try {
      const response = await clienteAxios.get(`/link?url=${url}&pin=${pin}`);
      setLink(response.data.data);
    } catch (error) {
      console.log('Error getting link information:', error.response); // Verifica los errores
    }
  };

  const updateLink = async (id: string, data: any) => {
    try {
      const response = await clienteAxios.put(`/link/${id}`, data);
      setLink(response.data.data);
    } catch (error) {
      console.log('Error updating link:', error.response); // Verifica los errores
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        noteMsg,
        loading,
        hasPhoto,
        imageOverlay,
        deleteSuccess,
        actualNote,
        copyLink,
        post,
        isPrivate,
        pinMessage,
        link,
        getNotes,
        addNote,
        updateNote,
        deleteNote,
        cleanNotes,
        updateCoordinates,
        showImageOverlay,
        hideImageOverlay,
        showErrorNote,
        getActualNote,
        generateLink,
        getLinkInformation,
        updateLink,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
