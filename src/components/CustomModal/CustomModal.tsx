/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Field } from 'Interfaces/Incidencias';
import { Semana } from 'Interfaces/Semana';

import SemanaCalendarSelector from './CalendarSelect/CalendarSelect';

import 'bootstrap/dist/css/bootstrap.min.css';

interface CustomModalProps {
  show: boolean;
  handleCloseModal: () => void;
  title: string;
  handleSubmit: (formData: any) => void;
  fields: Field[];
  ventanaActual?: any;

  semanasOptions?: Semana[];
  selectedSemana: string;
  setSelectedSemana?: (id: string) => void;

  meses?: string[];
  selectedMonth?: string;
  setSelectedMonth?: (month: string) => void;

  typelabel: string;
  showWeek?: boolean;
  mes?: boolean;
}

function CustomModal({
  show,
  handleCloseModal,
  title,
  handleSubmit,
  fields,
  ventanaActual,
  semanasOptions = [],
  selectedSemana,
  setSelectedSemana,
  meses = [],
  selectedMonth,
  setSelectedMonth,
  typelabel,
  showWeek = false,
  mes = false,
}: CustomModalProps) {
  const [formData, setFormData] = useState<any>({
    ...ventanaActual,
    enBacklog: ventanaActual?.enBacklog ?? false,
    month: selectedMonth ?? '',
    selectedSemana: selectedSemana ?? '',
  });

  const [isDragging, setIsDragging] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (ventanaActual) {
      setFormData((prev) => ({
        ...prev,
        ...ventanaActual,
        enBacklog: ventanaActual.enBacklog ?? false,
      }));
    }

    if (ventanaActual?.startDate && semanasOptions.length > 0) {
      const fechaVentana = new Date(ventanaActual.startDate).getTime();
      const semanaActual = semanasOptions.find(
        (s) => new Date(s.startDate).getTime() === fechaVentana
      );
      if (semanaActual?._id && semanaActual._id !== formData.selectedSemana) {
        setSelectedSemana?.(semanaActual._id);
        setFormData((prev) => ({
          ...prev,
          selectedSemana: semanaActual._id,
        }));
      }
    }
  }, [ventanaActual, semanasOptions]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    fieldName: string
  ) => {
    const { value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));

    if (fieldName === 'month' && setSelectedMonth) {
      setSelectedMonth(newValue);
    }
  };

  const handleMonthSelectChange = (e: SelectChangeEvent<string>) => {
    handleChange({ target: { value: e.target.value } } as any, 'month');
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(formData);
    setFormData({});
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStart) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setModalPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 300)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 300)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleClose = () => {
    setFormData({});
    setIsDragging(false);
    handleCloseModal();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName='modal-90w'
      style={{
        position: 'fixed',
        top: modalPosition.y,
        left: modalPosition.x,
        cursor: isDragging ? 'grabbing' : 'grab',
        fontSize: '14px',
      }}
      onMouseDown={handleMouseDown}
    >
      <Form onSubmit={handleFormSubmit}>
        <Modal.Header
          closeButton
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            backgroundColor: '#282d32',
            color: '#fff',
          }}
        >
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className='mb-3' controlId='ControlTextarea'>
            <Form.Check
              type='checkbox'
              label={typelabel}
              name='enBacklog'
              checked={formData.enBacklog || false}
              onChange={(e) => handleChange(e, 'enBacklog')}
            />

            {showWeek && (
              <SemanaCalendarSelector
                semanasOptions={semanasOptions}
                onSemanaSelect={(id) => {
                  setSelectedSemana?.(id);
                  setFormData((prev) => ({ ...prev, selectedSemana: id }));
                }}
              />
            )}

            {mes && (
              <Form.Group controlId='selectMeses'>
                <Form.Label>Mes</Form.Label>
                <Select
                  label='Mes: '
                  value={selectedMonth ?? ''}
                  onChange={handleMonthSelectChange}
                  style={{ width: '180px', fontSize: '16px' }}
                >
                  {meses.map((mes) => (
                    <MenuItem
                      key={mes}
                      value={mes}
                      style={{ fontSize: '16px' }}
                    >
                      {mes}
                    </MenuItem>
                  ))}
                </Select>
              </Form.Group>
            )}
          </Form.Group>

          {fields.map((field) => (
            <Form.Group key={field.name}>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(e, field.name)}
              />
            </Form.Group>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant='primary' type='submit'>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CustomModal;
