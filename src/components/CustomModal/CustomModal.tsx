/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { Field } from 'Interfaces/Incidencias';
import { Semana } from 'Interfaces/Semana';

import DropdownSemana from './DropDownSemanas/DropdownSemanas';

import 'bootstrap/dist/css/bootstrap.min.css';

interface CustomModalProps {
  show: boolean;
  handleCloseModal: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  handleSubmit: (formData: any) => void;
  fields: Field[];
  meses?: string[];
  setSelectedMonth?: (month: string) => void;
  selectedMonth?: string;
  ventanaActual?: any;
  selectedSemana?: string;
  semanasOptions?: Semana[];
  setSelectedSemana?: (id: string) => void;
  typelabel: string;
  showWeek?: boolean;
  mes?: boolean;
  handleSemanaChange: (event: SelectChangeEvent<string>) => void;
}

function CustomModal({
  show,
  handleCloseModal,
  title,
  handleSubmit,
  fields,
  meses,
  setSelectedMonth,
  selectedMonth,
  ventanaActual,
  selectedSemana,
  semanasOptions,
  setSelectedSemana,
  typelabel,
  showWeek,
  mes,
  onChange,
  handleSemanaChange,
}: CustomModalProps) {
  const handleMonthSelectChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      month: value,
    }));
    if (setSelectedMonth) {
      setSelectedMonth(value);
    }
  };
  const initialFormData = {
    ...(ventanaActual || {}),
    enBacklog: ventanaActual ? ventanaActual.enBacklog || false : false,
    month: '',
  };

  const [formData, setFormData] = useState<any>(initialFormData);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    if (show && ventanaActual) {
      setFormData(ventanaActual);
    }

    if (show && !hasMoved) {
      setModalPosition({
        x: 0,
        y: 0,
      });
    }
  }, [show, ventanaActual, hasMoved]);

  useEffect(() => {
    if (ventanaActual && semanasOptions) {
      const semanaActual = semanasOptions.find(
        (semana) =>
          new Date(semana.startDate).toLocaleDateString() ===
          new Date(ventanaActual.startDate).toLocaleDateString()
      );
      if (
        semanaActual &&
        formData.selectedSemana !== semanaActual._id // <-- Solo si cambia
      ) {
        if (setSelectedSemana && typeof semanaActual._id === 'string') {
          setSelectedSemana(semanaActual._id);
        }
        setFormData((prevFormData: typeof formData) => ({
          ...prevFormData,
          selectedSemana: semanaActual._id,
        }));
      }
    }
    // eslint-disable-next-line
  }, [ventanaActual, semanasOptions,formData.selectedSemana]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    fieldName: string
  ) => {
    const { value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;

    if (fieldName === 'month') {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [fieldName]: value,
      }));
      if (setSelectedMonth) {
        setSelectedMonth(value);
      }
    } else {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [fieldName]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataWithMonth = { ...formData };
    if (mes) {
      formDataWithMonth.month = selectedMonth;
    }
    handleSubmit(formDataWithMonth);
    setFormData(initialFormData);
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    formattedDate.setDate(formattedDate.getDate() + 1);

    const day = formattedDate.toLocaleDateString('es-ES', { day: 'numeric' });
    const month = (formattedDate.getMonth() + 1).toString();

    return `${day}/${month}`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragStart) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - 300));
    const clampedY = Math.max(0, Math.min(newY, window.innerHeight - 300));

    setModalPosition({ x: clampedX, y: clampedY });
    setHasMoved(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleClose = () => {
    setFormData({});
    setHasMoved(false);
    handleCloseModal();
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
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
          onMouseDown={handleMouseDown}
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
              <DropdownSemana
                semanasOptions={semanasOptions || []}
                selectedSemana={formData.selectedSemana}
                handleSemanaChange={handleSemanaChange}
              />
            )}
            {mes && (
              <Form.Group controlId='selectMeses'>
                <Form.Label>Mes</Form.Label>
                <Select
                  label='Mes: '
                  value={selectedMonth}
                  onChange={handleMonthSelectChange}
                  style={{ width: '180px', fontSize: '16px' }}
                >
                  {meses &&
                    meses.map((mes) => (
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

          {fields &&
            fields.map((field) => (
              <Form.Group key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type || 'text'}
                  name={field.name}
                  value={field.name ? formData[field.name as string] || '' : ''}
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
