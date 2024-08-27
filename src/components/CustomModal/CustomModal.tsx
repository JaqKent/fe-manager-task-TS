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
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Field } from 'Interfaces/Incidencias';
import { Semana } from 'Interfaces/Semana';

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './styles.module.scss';

// Define types for props and state

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
  ventanaActual?: never;
  selectedSemana?: string;
  semanasOptions?: Semana[];
  setSelectedSemana?: (id: string) => void;
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
}: CustomModalProps) {
  const initialFormData = {
    ...ventanaActual,
    enBacklog: ventanaActual ? ventanaActual.enBacklog || false : false,
    month: '',
  };

  const [formData, setFormData] = useState<any>(initialFormData);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>({
    x: window.innerWidth / 2 - 150,
    y: window.innerHeight / 2 - 150,
  });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (show && ventanaActual) {
      setFormData(ventanaActual);
    }
  }, [show, ventanaActual]);

  useEffect(() => {
    if (ventanaActual && semanasOptions) {
      const semanaActual = semanasOptions.find(
        (semana) =>
          formatDate(semana.startDate) === formatDate(ventanaActual.startDate)
      );
      if (semanaActual) {
        setSelectedSemana(semanaActual._id);
        localStorage.setItem('selectedOption', semanaActual._id);
      }
    }
  }, [ventanaActual, semanasOptions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: string
  ) => {
    const { value, type, checked } = e.target;

    if (fieldName === 'month') {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [fieldName]: value,
      }));
      setSelectedMonth(value);
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
    const month = (formattedDate.getMonth() + 1).toLocaleString('es-ES', {
      month: 'numeric',
    });

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
              <>
                <Form.Label>Semana Destino</Form.Label>
                <Select
                  label='Semana Destino: '
                  value={selectedSemana}
                  onChange={(e) => setSelectedSemana(e.target.value)}
                  style={{ width: '180px', fontSize: '16px' }}
                >
                  {semanasOptions &&
                    semanasOptions.map((semana) => (
                      <MenuItem
                        key={semana._id}
                        value={semana._id}
                        style={{ fontSize: '16px' }}
                      >
                        {`${formatDate(semana.startDate)} - ${formatDate(
                          semana.endDate
                        )}`}
                      </MenuItem>
                    ))}
                </Select>
              </>
            )}
            {mes && (
              <Form.Group controlId='selectMeses'>
                <Form.Label>Mes</Form.Label>
                <Select
                  label='Mes: '
                  value={selectedMonth}
                  onChange={(e) => handleChange(e, 'month')}
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
          <Row>
            <Col>
              {fields.slice(0, 4).map((item, index) => (
                <Form.Group
                  key={item.name}
                  className={`mb-3 ${
                    item.name === 'update' ? 'modal-font' : ''
                  }`}
                  controlId={`ControlTextarea${index}`}
                >
                  <Form.Label>{item.label}</Form.Label>
                  <Form.Control
                    placeholder={item.label}
                    as={item.type}
                    rows={3}
                    name={item.name}
                    value={formData[item.name] || ''}
                    onChange={(e) => handleChange(e, item.name)}
                    required={item.required}
                    style={{
                      fontFamily: 'var(--textFont)',
                      fontSize: item.name === 'update' ? '15px' : 'inherit',
                    }}
                  />
                </Form.Group>
              ))}
            </Col>
            <Col>
              {fields.slice(4, 8).map((item, index) => (
                <Form.Group
                  key={item.name}
                  className={`mb-3 ${
                    item.name === 'update' ? 'modal-font' : ''
                  }`}
                  controlId={`ControlTextarea${index + 4}`}
                >
                  <Form.Label>{item.label}</Form.Label>
                  <Form.Control
                    placeholder={item.label}
                    as={item.type}
                    rows={3}
                    name={item.name}
                    value={formData[item.name] || ''}
                    onChange={(e) => handleChange(e, item.name)}
                    required={item.required}
                    style={{
                      fontFamily: 'var(--textFont)',
                      fontSize: item.name === 'update' ? '15px' : 'inherit',
                    }}
                  />
                </Form.Group>
              ))}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={handleClose}
            style={{
              fontFamily: 'var(--textFont)',
              fontSize: '14px',
            }}
          >
            Cerrar
          </Button>
          <Button
            variant='primary'
            type='submit'
            style={{
              fontFamily: 'var(--textFont)',
              fontSize: '14px',
            }}
          >
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CustomModal;
