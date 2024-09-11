/* eslint-disable import/extensions */
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from '~components/auth/login';
import NuevaCuenta from '~components/auth/nuevaCuenta';
import BacklogVentanaMain from '~components/BacklogCerrado/backlogVentana/BacklogVentanaMain/BacklogVentanaMain';
import IncidenciaCerrada from '~components/BacklogCerrado/incidenciaCerrada/IncidenciaCerrada/incidenciaCerrada';
import Incidencias from '~components/Incidencias/Incidencias/Incidencias';
import InformesHome from '~components/Informes/Dashboard/InformesHome';
import IncidenciaScreen from '~components/Informes/InformeIncidencias/InformeIncidencias';
import VentanaScreen from '~components/Informes/InformeVentanas/InformeVentanas';
import Footer from '~components/Layout/Footer/Footer';
import CustomNavbar from '~components/Layout/NavBar/NavBar';
import LegacyBranch from '~components/Layout/OldBrach/LegacyContent';
import RutaPrivada from '~components/Rutas/RutaPrivada';
import NuevaSemanaAutomatica from '~components/Semanas/NuevaSemana/NuevaSemana';
import Semanas from '~components/Semanas/Semanas/Semanas';
import tokenAuth from '~config/token';
import { AlertaProvider } from '~contexts/alert/AlertContext';
import AuthProvider from '~contexts/auth/AuthContext';
import InformesIncidenciaProvider from '~contexts/CambiosIncidencia/CambiosIncidencia';
import InformesVentanaProvider from '~contexts/CambiosVentana/CambiosVentana';
import CommentIncidenciaProvider from '~contexts/CommentIncidencia/CommentIncidencia';
import CommentVentanaProvider from '~contexts/CommentVentana/CommentVentana';
import IncidenciaProvider from '~contexts/incidencias/Incidencias';
import NoteProvider from '~contexts/Notes/Notes';
import SemanaProvider from '~contexts/Semana/Semana';
import VentanaProvider from '~contexts/Ventana/Ventana';

// Revisar si tenemos Token
const token = localStorage.getItem('token');
if (token) {
  tokenAuth(token);
}

function App() {
  return (
    <IncidenciaProvider>
      <AlertaProvider>
        <AuthProvider>
          <SemanaProvider>
            <VentanaProvider>
              <IncidenciaProvider>
                <CommentIncidenciaProvider>
                  <CommentVentanaProvider>
                    <NoteProvider>
                      <InformesVentanaProvider>
                        <InformesIncidenciaProvider>
                          <NuevaSemanaAutomatica />
                          <Router>
                            <Routes>
                              {/* Rutas que no requieren autenticación */}
                              <Route path='/' element={<Login />} />
                              <Route
                                path='/nueva-cuenta'
                                element={<NuevaCuenta />}
                              />
                              {/* Rutas que requieren autenticación */}
                              <Route
                                path='/incidencias/*'
                                element={
                                  <RutaPrivada>
                                    <>
                                      <CustomNavbar />
                                      <Incidencias />
                                      <Footer />
                                    </>
                                  </RutaPrivada>
                                }
                              />
                              <Route
                                path='/weeks/*'
                                element={
                                  <RutaPrivada>
                                    <>
                                      <CustomNavbar />
                                      <Semanas />
                                      <Footer />
                                    </>
                                  </RutaPrivada>
                                }
                              />
                              <Route
                                path='/informesHome/*'
                                element={
                                  <RutaPrivada>
                                    <>
                                      <CustomNavbar />
                                      <InformesHome />
                                    </>
                                  </RutaPrivada>
                                }
                              />
                              <Route
                                path='/cerrado-incidencias/*'
                                element={
                                  <RutaPrivada>
                                    <>
                                      <CustomNavbar />
                                      <IncidenciaCerrada />
                                      <Footer />
                                    </>
                                  </RutaPrivada>
                                }
                              />
                              <Route
                                path='/backlog-ventanas/*'
                                element={
                                  <RutaPrivada>
                                    <>
                                      <CustomNavbar />
                                      <BacklogVentanaMain />
                                      <Footer />
                                    </>
                                  </RutaPrivada>
                                }
                              />
                              <Route
                                path='/LegacyBranch/*'
                                element={
                                  <RutaPrivada>
                                    <>
                                      <CustomNavbar />
                                      <LegacyBranch />
                                      <Footer />
                                    </>
                                  </RutaPrivada>
                                }
                              />
                              <Route
                                path='/informeIncidencias/*'
                                element={
                                  <RutaPrivada>
                                    <>
                                      <CustomNavbar />
                                      <IncidenciaScreen />
                                      <Footer />
                                    </>
                                  </RutaPrivada>
                                }
                              />
                              <Route
                                path='/InformeVentanas/*'
                                element={
                                  <RutaPrivada>
                                    <>
                                      <CustomNavbar />
                                      <VentanaScreen />
                                      <Footer />
                                    </>
                                  </RutaPrivada>
                                }
                              />
                            </Routes>
                          </Router>
                        </InformesIncidenciaProvider>
                      </InformesVentanaProvider>
                    </NoteProvider>
                  </CommentVentanaProvider>
                </CommentIncidenciaProvider>
              </IncidenciaProvider>
            </VentanaProvider>
          </SemanaProvider>
        </AuthProvider>
      </AlertaProvider>
    </IncidenciaProvider>
  );
}

export default App;
