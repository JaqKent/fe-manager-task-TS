import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaMicrophoneAlt, FaRegStopCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Rnd } from 'react-rnd';
import moment from 'moment';

import { useNoteContext } from '~contexts/Notes/Notes';

import { createSpeechRecognitionUtils } from '../../../utils/VoiceRecognition';
import DropdownNote from '../DropdownNote/DropdownNote';
import Textarea from '../TextArea/Textarea';

import './Note.css';

interface NoteProps {
  note: {
    _id: string;
    title: string;
    description: string;
    status: string;
    ejeX: number;
    ejeY: number;
    updateDate: string;
    active: boolean;
  };
  noteList: any[];
  handleList: (notes: any[]) => void;
}

function Note({ note, noteList, handleList }: NoteProps) {
  const [showMarkdown, setShowMarkdown] = useState(true);
  const [noteValues, setNoteValues] = useState(note);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const { startRecognition, stopRecognition, onResult, onError } =
    createSpeechRecognitionUtils();

  const { updateNote, getActualNote } = useNoteContext();

  useEffect(() => {
    onResult((transcript: string) => {
      setTranscript(transcript);
      setNoteValues((prev) => ({ ...prev, description: transcript }));
      // Guardar automáticamente cada vez que se actualiza la transcripción
      updateNote(
        note._id,
        { ...noteValues, description: transcript },
        'update'
      );
    });

    onError((error: string) => {
      console.error('Speech recognition error:', error);
    });

    return () => {
      stopRecognition();
    };
  }, [onResult, onError, stopRecognition, noteValues, updateNote, note._id]);

  useEffect(() => {
    if (isListening) {
      startRecognition();
    } else {
      stopRecognition();
    }
  }, [isListening, startRecognition, stopRecognition]);

  useEffect(() => {
    setNoteValues(note);
  }, [note]);

  const saveNote = (e: React.FocusEvent<HTMLFormElement>) => {
    const noteId = e.target.closest('form')?.id;
    if (noteId) {
      updateNote(
        noteId,
        {
          title: noteValues.title,
          description: noteValues.description,
          active: noteValues.active,
          ejeX: noteValues.ejeX,
          ejeY: noteValues.ejeY,
        },
        'update'
      );
    }
  };

  const getBackgroundNoteClass = () => {
    return note.active ? 'note_active' : 'note_completed';
  };

  return (
    <Rnd
      default={{ x: note.ejeX, y: note.ejeY }}
      onDragStop={(e, d) => {
        const updatedNotes = noteList.map((n) =>
          n._id === note._id ? { ...noteValues, ejeX: d.x, ejeY: d.y } : n
        );
        handleList(updatedNotes);
        setNoteValues((prev) => ({ ...prev, ejeX: d.x, ejeY: d.y }));
        updateNote(note._id, { ...noteValues, ejeX: d.x, ejeY: d.y }, 'update');
      }}
      bounds='parent'
    >
      <form
        onBlur={!showMarkdown ? saveNote : undefined}
        id={note._id}
        className={`note ${getBackgroundNoteClass()}`}
        onClick={() => {
          if (!showMarkdown) {
            getActualNote(note._id);
          }
        }}
      >
        <DropdownNote
          options={['active', 'completed']}
          updateNote={updateNote}
          noteId={note._id}
          status={note.status}
          setIsShowModal={() => {}}
        />
        <div className='note_cnt'>
          <Textarea
            name='title'
            maxLength={40}
            isResize
            placeholder='Title'
            showMarkdown={showMarkdown}
            setShowMarkdown={setShowMarkdown}
            noteValues={noteValues}
            setNoteValues={setNoteValues}
            value={noteValues.title}
          />
          <div className='d-flex justify-content-between'>
            <h5 className='subtitle my-auto description-size'>Description</h5>
            <OverlayTrigger
              placement='right'
              overlay={<Tooltip id='tooltip-disabled'>Record</Tooltip>}
            >
              <button
                type='button'
                className='mic border-0 bg-transparent my-auto text-info'
                onClick={(e) => {
                  e.preventDefault();
                  setIsListening((prevState) => !prevState);
                }}
                disabled={!note}
              >
                {isListening ? <FaRegStopCircle /> : <FaMicrophoneAlt />}
              </button>
            </OverlayTrigger>
          </div>
          <div
            onBlur={() => setShowMarkdown(!showMarkdown)}
            onClick={() => setShowMarkdown(false)}
            onTouchStart={() => setShowMarkdown(false)}
          >
            {showMarkdown && noteValues.description ? (
              <div className='d-flex flex-column markdown-container mb-3'>
                <ReactMarkdown
                  className='font-size text-ellipsis markdown-size'
                  children={noteValues.description}
                />
              </div>
            ) : (
              <Textarea
                maxLength={300}
                placeholder='Description'
                classes='cnt'
                name='description'
                value={noteValues.description || transcript}
                showMarkdown={showMarkdown}
                setShowMarkdown={setShowMarkdown}
                noteValues={noteValues}
                setNoteValues={setNoteValues}
              />
            )}
          </div>
        </div>
        <small className='small_time'>
          Last Modified {moment(note.updateDate).fromNow()}
        </small>
      </form>
    </Rnd>
  );
}

export default Note;
