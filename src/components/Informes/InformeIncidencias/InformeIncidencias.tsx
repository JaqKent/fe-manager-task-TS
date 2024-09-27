/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable max-lines */
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import jsPDF from 'jspdf';

import { useInformesIncidenciaContext } from '~contexts/CambiosIncidencia/CambiosIncidencia';

import styles from './styles.module.scss';

function IncidenciaScreen() {
  const {
    incidenciaDetallada,
    cambiosCommentIncidencia,
    obtenerCambiosCommentsIncidenciaPorFecha,
    obtenerDetalleCommentIncidencia,
    idsComentariosIncidencias,
    detallesCargados,
    limpiarCambiosCommentIncidencia,
    setIncidenciaDetallada,
    setDetallesCargados,
  } = useInformesIncidenciaContext();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const [incidenciasRenderizadas, setIncidenciasRenderizadas] = useState(
    new Set()
  );
  useEffect(() => {
    const limpiarEstado = () => {
      setIncidenciaDetallada([]);
      setDetallesCargados(false);
      setLoading(false);
      setBusquedaRealizada(false);
    };

    limpiarEstado();
  }, []);

  const handleSubmit = () => {
    setIncidenciaDetallada([]);
    setDetallesCargados(false);
    setBusquedaRealizada(false);
    limpiarCambiosCommentIncidencia();

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    obtenerCambiosCommentsIncidenciaPorFecha(
      formattedStartDate,
      formattedEndDate
    );
    setLoading(true);
    setBusquedaRealizada(true);
  };

  useEffect(() => {
    if (idsComentariosIncidencias.length > 0) {
      obtenerDetalleCommentIncidencia(idsComentariosIncidencias);
    }
  }, [idsComentariosIncidencias]);

  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000); // 5 segundos

      return () => clearTimeout(timeoutId);
    }
  }, [loading]);

  const generarPDF = () => {
    const doc = new jsPDF();
    let yPos = 10;

    doc.setFontSize(20);
    doc.text('Informe de Minutas Incidencia', 10, yPos);
    yPos += 10;

    const fechaInicioImpresion = startDate.toISOString().split('T')[0];
    const fechaFinImpresion = endDate.toISOString().split('T')[0];

    doc.setFontSize(12);
    doc.text(`Desde: ${fechaInicioImpresion}`, 10, yPos);
    yPos += 5;
    doc.text(`Hasta: ${fechaFinImpresion}`, 10, yPos);
    yPos += 10;

    incidenciaDetallada.forEach((incidencia, index) => {
      if (index > 0) {
        doc.addPage();
        yPos = 10; // Reset position for new page
      }

      if (incidenciasRenderizadas.has(incidencia._id)) {
        return; // Skip rendering if already rendered
      }
      setIncidenciasRenderizadas((prev) => new Set(prev).add(incidencia._id));

      doc.setFontSize(16);
      doc.text('Informe de Minutas', 10, yPos);
      yPos += 10;

      doc.setFontSize(14);
      doc.text(
        `Descripción: ${incidencia.incidencia.descripcion || 'Descripción no encontrada'}`,
        10,
        yPos
      );
      yPos += 10;

      doc.text(`Detalles de la Incidencia:`, 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(
        `Número de Incidencia: ${incidencia.incidencia.incidenciaNumber || 'Sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;

      doc.text(
        `Criticidad: ${incidencia.incidencia.criticidad || 'Sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;

      doc.text(
        `Fecha de Modificación: ${incidencia.incidencia.fechaModificacion ? new Date(incidencia.incidencia.fechaModificacion).toLocaleDateString() : 'Sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;

      doc.text(
        `Asignado a: ${incidencia.incidencia.asignado || 'Sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;

      const comentarios = cambiosCommentIncidencia.filter(
        (comment) => comment.incidencias === incidencia.incidencia._id
      );

      if (comentarios.length > 0) {
        doc.setFontSize(14);
        doc.text('Cambios Realizados:', 10, yPos);
        yPos += 10;

        comentarios.forEach((comment) => {
          doc.setFontSize(12);
          doc.text(
            `Fecha del Cambio: ${new Date(comment.fecha).toLocaleDateString()}`,
            10,
            yPos
          );
          yPos += 5;
          doc.text(
            `Usuario: ${comment.usuarioId || 'Usuario no identificado'}`,
            10,
            yPos
          );
          yPos += 5;
          comment.cambios.forEach((cambio, index) => {
            doc.text(`Campo Modificado: ${cambio.campo}`, 10, yPos);
            yPos += 5;
            doc.text(`Valor Nuevo: ${cambio.valorNuevo}`, 10, yPos);
            yPos += 10;
          });

          if (yPos >= doc.internal.pageSize.height - 10) {
            doc.addPage();
            yPos = 10;
          }
        });
      }

      if (yPos >= doc.internal.pageSize.height - 10) {
        doc.addPage();
        yPos = 10;
      }
    });

    doc.save('informe_incidencias.pdf');
  };

  return (
    <div className={styles.containerMinutas}>
      <h1 className={styles.tituloMinutas}>Informe de minutas Incidencia</h1>
      <div className={styles.minutasBody}>
        <div className={styles.columnaIzquierda}>
          <h4>Selecciona las fechas en las que buscar el informe</h4>
          <div className={styles.contenedorFecha}>
            <p>Desde: </p>
            <input
              type='date'
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setStartDate(new Date(e.target.value));
              }}
            />
            <p>Hasta: </p>
            <input
              type='date'
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setEndDate(new Date(e.target.value));
              }}
            />
            <button
              type='button'
              className={styles.butnPrimario}
              onClick={handleSubmit}
            >
              Buscar cambios
            </button>
            {incidenciaDetallada.length > 0 ? (
              <button
                type='button'
                onClick={generarPDF}
                className={styles.butnPrimario}
              >
                Imprimir minutas
              </button>
            ) : null}
          </div>
        </div>
        <div>
          {loading ? (
            <div className={styles.spinner}>
              <Spinner />
            </div>
          ) : incidenciaDetallada.length > 0 ? (
            incidenciaDetallada.map((incidencia) => (
              <div key={incidencia._id} className={styles.minutaSeccion}>
                <h2>Informe de minutas</h2>
                <h3 className={styles.tituloIncidencia}>
                  Descripcion:{' '}
                  {incidencia.incidencia.descripcion ||
                    'Descripción no encontrada'}
                </h3>
                <div className={styles.detallesIncidencia}>
                  <h4>Detalles de la incidencia en los que se trabajo</h4>
                  <p>
                    <strong>Número de Incidencia:</strong>{' '}
                    {incidencia.incidencia.incidenciaNumber ||
                      'Sin datos cargados'}
                  </p>
                  <p>
                    <strong>Criticidad:</strong>{' '}
                    {incidencia.incidencia.criticidad || 'Sin datos cargados'}
                  </p>
                  <p>
                    <strong>Fecha de Modificación:</strong>{' '}
                    {new Date(
                      incidencia.incidencia.fechaModificacion
                    ).toLocaleDateString() || 'Sin datos cargados'}
                  </p>
                  <p>
                    <strong>Asignado a:</strong>{' '}
                    {incidencia.incidencia.asignado || 'Sin datos cargados'}
                  </p>
                </div>

                <div className={styles.cambiosIncidencia}>
                  <h3>Cambios Realizados:</h3>
                  <ul>
                    {cambiosCommentIncidencia
                      .filter(
                        (comment) =>
                          comment.incidencias === incidencia.incidencia._id
                      )
                      .map((comment) => (
                        <li key={comment._id} className={styles.cambioItem}>
                          <p>
                            <strong>Fecha del Cambio:</strong>{' '}
                            {new Date(comment.fecha).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Usuario:</strong> {comment.usuarioId}
                          </p>
                          {comment.cambios.map((cambio, index) => (
                            <div key={index}>
                              <p>
                                <strong>Campo Modificado:</strong>{' '}
                                {cambio.campo}
                              </p>
                              <p>
                                {' '}
                                <strong>Valor Nuevo:</strong>{' '}
                                {cambio.valorNuevo}
                              </p>
                            </div>
                          ))}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            busquedaRealizada && (
              <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
                <Alert severity='info'>
                  <AlertTitle className='titulo-error1'>Info</AlertTitle>
                  <b className='titulo-error'>
                    No hay informes disponibles para las fechas seleccionadas
                  </b>
                </Alert>
              </Stack>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default IncidenciaScreen;
