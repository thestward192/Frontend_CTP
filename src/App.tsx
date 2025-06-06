// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/componentsPages/Login';
import Register from './Components/componentsPages/Register';
import ForgotPassword from './Components/componentsPages/ForgotPassword';
import ResetPassword from './Components/componentsPages/ResetPassword';

import MenuAdminComponent from './Components/componentsAdminMenu/MenuAdminComponent';
import MenuAdminProveedores from './Components/componentsAdminProveedor/MenuProveedoresComponent';
import MenuLicitaciones from './Components/componentsAdminLicitaciones/MenuLicitaciones';
import MenuLeyes from './Components/componentsAdminLeyes/MenuLeyesComponent';
import MenuUbicacion from './Components/componentsAdminUbicaciones/MenuUbicacionesComponent';
import MenuAdminLicencias from './Components/componentsLicencias/MenuAdminLicencias';
import MenuReportesPrestamos from './Components/componentsAdminReportes/MenuReportesPrestamos';
import MenuReportesInventario from './Components/componentsAdminReportes/MenuReportesInventario';

import MenuDocenteAdmin from './Components/componentsAdminUsuario/MenuDocentesComponent';
import MenuDocente from './ComponentsDocente/componentsMenuDocente/MenuDocente';
import MenuPrestamosDocente from './ComponentsDocente/componentsPrestamoDocente/MenuPrestamosDocente';
import MenuInventarioDocente from './ComponentsDocente/componentsInventarioDocente/MenuInventarioDocente';

import ProtectedRoute from './hooks/ProtectedRoute';
import { AuthProvider } from './hooks/AuthContext';
import MenuImportAssets from './Components/ComponentsAdminImportAssets/MenuImportAssets';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/Register" element={<Register />} />

          {/* Administrador */}
          <Route
            path="/MenuAdmin"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuAdminComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Proveedores"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuAdminProveedores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Licitaciones"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuLicitaciones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Leyes"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuLeyes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Ubicacion"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuUbicacion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Licencias"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuAdminLicencias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ReportesPrestamos"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuReportesPrestamos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ReportesInventario"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuReportesInventario />
              </ProtectedRoute>
            }
          />

          {/*Importar Activos */}
          <Route
            path="/ImportarActivos"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuImportAssets />
              </ProtectedRoute>
            }
          />

          {/* Docente */}
          <Route
            path="/DocentesAdmin"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <MenuDocenteAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MenuDocente"
            element={
              <ProtectedRoute roles={['Docente']}>
                <MenuDocente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PrestamosDocente"
            element={
              <ProtectedRoute roles={['Docente']}>
                <MenuPrestamosDocente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InventarioDocente"
            element={
              <ProtectedRoute roles={['Docente']}>
                <MenuInventarioDocente />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
