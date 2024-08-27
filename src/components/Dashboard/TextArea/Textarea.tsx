/* eslint-disable react/require-default-props */
import React, { useEffect, useRef, useState } from 'react';

interface TextareaProps {
  isResize?: boolean;
  name: string;
  maxLength?: number;
  classes?: string;
  placeholder?: string;
  showMarkdown: boolean;
  setShowMarkdown: React.Dispatch<React.SetStateAction<boolean>>;
  noteValues?: { [key: string]: any };
  setNoteValues?: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  value: string;
  disabled?: boolean;
}

function Textarea({
  isResize = false,
  name,
  maxLength,
  classes = '',
  placeholder,
  showMarkdown,
  setShowMarkdown,
  noteValues,
  setNoteValues,
  value,
  disabled = false,
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState<string>(value);
  const [textareaHeight, setTextareaHeight] = useState<string>('auto');
  const [parentHeight, setParentHeight] = useState<string>('auto');

  useEffect(() => {
    if (textareaRef.current) {
      setParentHeight(`${textareaRef.current.scrollHeight + 1}px`);
      setTextareaHeight(`${textareaRef.current.scrollHeight + 1}px`);
    }
    setText(value);
  }, [value]);

  const parentStyle: React.CSSProperties = {
    minHeight: parentHeight === '1px' ? '33px' : parentHeight,
  };

  const textareaStyle: React.CSSProperties = {
    height: textareaHeight === '1px' ? '57px' : textareaHeight,
  };

  return (
    <div style={isResize ? parentStyle : undefined}>
      <textarea
        ref={textareaRef}
        style={isResize ? textareaStyle : undefined}
        rows={1}
        placeholder={placeholder}
        onChange={(e) => {
          if (textareaRef.current) {
            setTextareaHeight('auto');
            setParentHeight(`${textareaRef.current.scrollHeight}px`);
          }
          setText(e.target.value);
          if (setNoteValues) {
            setNoteValues((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }
        }}
        value={text}
        maxLength={maxLength}
        onBlur={() => setShowMarkdown(!showMarkdown)}
        onTouchStart={() => setShowMarkdown(false)}
        onClick={() => setShowMarkdown(false)}
        className={classes}
        name={name}
        disabled={disabled}
      />
    </div>
  );
}

export default Textarea;
