/* eslint-disable no-underscore-dangle */
/* eslint-disable max-lines */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import jsPDF from 'jspdf';

import { useInformesVentanaContext } from '~contexts/CambiosVentana/CambiosVentana';

import styles from './styles.module.scss';

function VentanaScreen() {
  const {
    obtenerCambiosCommentsVentanaPorFecha,
    obtenerDetalleCommentVentana,
    cambiosCommentVentana,
    idsComentariosVentanas,
    ventanaDetallada,
    detallesCargados,
    warning,
    setDetallesCargados,
    setVentanaDetallada,
  } = useInformesVentanaContext();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const [ventanasRenderizadas, setVentanasRenderizadas] = useState(new Set());
  useEffect(() => {
    const limpiarEstado = () => {
      setVentanaDetallada([]);
      setDetallesCargados(false);
      setLoading(false);
      setBusquedaRealizada(false);
    };

    limpiarEstado();
  }, []);

  const handleSubmit = () => {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    obtenerCambiosCommentsVentanaPorFecha(formattedStartDate, formattedEndDate);
    setLoading(true);
    setBusquedaRealizada(true);
  };

  const limpiarCambiosVentana = async () => {
    await obtenerCambiosCommentsVentanaPorFecha([], []);
  };

  useEffect(() => {
    limpiarCambiosVentana();
  }, [startDate, endDate]);

  useEffect(() => {
    const limpiarEstado = () => {
      setVentanaDetallada([]);
      setDetallesCargados(false);
      setLoading(false);
      setBusquedaRealizada(false);
    };

    limpiarEstado();
  }, []);

  useEffect(() => {
    if (idsComentariosVentanas && idsComentariosVentanas.length > 0) {
      obtenerDetalleCommentVentana(idsComentariosVentanas);
    }
  }, [idsComentariosVentanas]);

  useEffect(() => {
    if (cambiosCommentVentana.length > 0 && detallesCargados) {
      setLoading(false);
    }
  }, [cambiosCommentVentana, detallesCargados]);

  const generarPDF = () => {
    const doc = new jsPDF();
    let yPos = 10;
    const ventanasRenderizadas = new Set<string>(); // Inicializar el conjunto

    doc.setFontSize(20);
    doc.text('Informe de Minutas Ventanas', 10, yPos);
    yPos += 10;

    const fechaInicioImpresion = startDate.toISOString().split('T')[0];
    const fechaFinImpresion = endDate.toISOString().split('T')[0];

    doc.setFontSize(12);
    doc.text(`Desde: ${fechaInicioImpresion}`, 10, yPos);
    yPos += 5;
    doc.text(`Hasta: ${fechaFinImpresion}`, 10, yPos);
    yPos += 10;

    ventanaDetallada.forEach((ventana, index) => {
      if (index > 0) {
        doc.addPage();
        yPos = 10; // Reset position for new page
      }

      if (ventanasRenderizadas.has(ventana._id)) {
        return; // Skip rendering if already rendered
      }
      ventanasRenderizadas.add(ventana._id);

      doc.setFontSize(16);
      doc.text('Informe de Minutas', 10, yPos);
      yPos += 10;

      doc.setFontSize(14);
      doc.text(
        `Descripción de la Ventana en la que se trabajo: ${ventana.ventana.descripcion || 'Descripción no encontrada'}`,
        10,
        yPos
      );
      yPos += 10;

      doc.text(`Detalles de la Ventana:`, 10, yPos);
      yPos += 10;

      doc.text(
        `Solicitante: ${ventana.ventana.solicitante || 'sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;
      doc.text(
        `Estado: ${ventana.ventana.estado || 'sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;
      doc.text(
        `Fecha de Implementación: ${ventana.ventana.fechaImplementacion || 'sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;
      doc.text(`CRQ: ${ventana.ventana.crq || 'sin datos cargados'}`, 10, yPos);
      yPos += 10;
      doc.text(
        `Ejecuta la Tarea: ${ventana.ventana.ejecutaTarea || 'sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;
      doc.text(
        `Controla: ${ventana.ventana.controla || 'sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;
      doc.text(
        `Pruebas Post: ${ventana.ventana.pruebasPost || 'sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;
      doc.text(
        `Impacto / Notificación: ${ventana.ventana.impactoNotificacion || 'sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;
      doc.text(
        `Afecta IDP: ${ventana.ventana.afectaIdp || 'sin datos cargados'}`,
        10,
        yPos
      );
      yPos += 10;

      const updates = cambiosCommentVentana.filter(
        (comment) => comment.ventana === ventana.ventana._id
      );
      if (updates.length > 0) {
        yPos += 10;
        doc.setFontSize(14);
        doc.text('Cambios Realizados:', 10, yPos);
        yPos += 10; // Add space between 'Cambios Realizados:' and the first change

        updates.forEach((comment) => {
          doc.setFontSize(12);
          doc.text(
            `Fecha del Cambio: ${new Date(comment.fecha).toLocaleDateString()}`,
            10,
            yPos
          );
          yPos += 10;
          doc.text(
            `Usuario: ${comment.usuarioId || 'Usuario no identificado'}`,
            10,
            yPos
          );
          yPos += 10;

          comment.cambios.forEach((cambio) => {
            doc.text(`Campo Modificado: ${cambio.campo}`, 10, yPos);
            yPos += 5;
            doc.text(`Valor Nuevo: ${cambio.valorNuevo}`, 10, yPos);
            yPos += 10;

            // Check for page break
            if (yPos >= doc.internal.pageSize.height - 20) {
              doc.addPage();
              yPos = 10;
            }
          });

          // Check for page break after each comment
          if (yPos >= doc.internal.pageSize.height - 20) {
            doc.addPage();
            yPos = 10;
          }
        });
      }

      yPos += 30;
      // Check for page break after each ventana
      if (yPos >= doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPos = 10;
      }
    });

    doc.save('informe_ventanas.pdf');
  };

  return (
    <div className={styles.containerMinutas}>
      <h1 className={styles.tituloMinutas}>Informe de Minutas Ventanas</h1>
      <div className={styles.minutasBody}>
        <div className={styles.columnaIzquierda}>
          <h4>Selecciona las fechas en la cual buscar el informe</h4>
          <div className={styles.contenedorFecha}>
            <p>Desde: </p>
            <input
              type='date'
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
            <p>Hasta: </p>
            <input
              type='date'
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
            <button
              type='button'
              className={styles.butnPrimario}
              onClick={handleSubmit}
            >
              Buscar cambios
            </button>
            {ventanaDetallada.length > 0 && (
              <button
                type='button'
                onClick={generarPDF}
                className={styles.butnPrimario}
              >
                Imprimir minutas
              </button>
            )}
          </div>
        </div>
        <div>
          {loading ? (
            <div className={styles.spinner}>
              <Spinner />
            </div>
          ) : (
            ventanaDetallada.map((ventana) => (
              <div className={styles.minutaSeccion} key={ventana._id}>
                <h2>Informe de minutas</h2>
                <h3 className={styles.tituloIncidencia}>
                  Descripción de la Ventana :{' '}
                  {ventana.ventana.descripcion || 'Descripción no encontrada'}
                </h3>
                <div className={styles.detallesIncidencia}>
                  <p>
                    <strong> Solicitante :</strong>
                    {ventana.ventana.solicitante || 'sin datos cargados'}
                  </p>
                  <p>
                    <strong> Estado :</strong>
                    {ventana.ventana.estado || 'sin datos cargados'}
                  </p>
                  <p>
                    <strong> Fecha de Implementación :</strong>
                    {ventana.ventana.fechaImplementacion ||
                      'sin datos cargados'}
                  </p>
                  <p>
                    <strong> CRQ :</strong>
                    {ventana.ventana.crq || 'sin datos cargados'}
                  </p>
                  <p>
                    <strong> Ejecuta la Tarea :</strong>
                    {ventana.ventana.ejecutaTarea || 'sin datos cargados'}
                  </p>
                  <p>
                    <strong> Controla :</strong>
                    {ventana.ventana.controla || 'sin datos cargados'}
                  </p>
                  <p>
                    <strong>Pruebas Post :</strong>
                    {ventana.ventana.pruebasPost || 'sin datos cargados'}
                  </p>
                  <p>
                    <strong> Impacto / Notificación :</strong>
                    {ventana.ventana.impactoNotificacion ||
                      'sin datos cargados'}
                  </p>
                  <p>
                    <strong>Afecta IDP :</strong>
                    {ventana.ventana.afectaIdp || 'sin datos cargados'}
                  </p>
                </div>

                <div className={styles.cambiosIncidencia}>
                  <h3>Cambios Realizados:</h3>
                  <ul>
                    {cambiosCommentVentana
                      .filter(
                        (comment) => comment.ventana === ventana.ventana._id
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
          )}
          {warning && busquedaRealizada && (
            <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
              <Alert severity='warning'>
                <AlertTitle className='titulo-error1'>Warning</AlertTitle>
                <b className='titulo-error'>
                  No hay informes disponibles para las fechas seleccionadas
                </b>
              </Alert>
            </Stack>
          )}
        </div>
      </div>
    </div>
  );
}

export default VentanaScreen;
function InformesVentanaContext(): {
  obtenerCambiosCommentsVentanaPorFecha: any;
  obtenerDetalleCommentVentana: any;
  cambiosCommentVentana: any;
  idsComentariosVentanas: any;
  ventanaDetallada: any;
  detallesCargados: any;
  warning: any;
  setDetallesCargados: any;
  setIncidenciaDetallada: any;
} {
  throw new Error('Function not implemented.');
}
