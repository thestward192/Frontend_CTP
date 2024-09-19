import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/componentsPages/Login';
import Register from './Components/componentsPages/Register';
import MenuAdminComponent from './Components/componentsAdminMenu/MenuAdminComponent';
import MenuAdminProveedores from './Components/componentsAdminProveedor/MenuProveedoresComponent';
import MenuLicitaciones from './Components/componentsAdminLicitaciones/MenuLicitaciones';
import MenuLeyes from './Components/componentsAdminLeyes/MenuLeyesComponent';
import MenuUbicacion from './Components/componentsAdminUbicaciones/MenuUbicacionesComponent';
import MenuDocenteAdmin from './Components/componentsAdminDocentes/MenuDocentesComponent';
import MenuAdminLicencias from './Components/componentsLicencias/MenuAdminLicencias';
import MenuDocente from './ComponentsDocente/componentsMenuDocente/MenuDocente';
import ProtectedRoute from './hooks/ProtectedRoute';
import { AuthProvider } from './hooks/AuthContext';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/MenuAdmin" element={<ProtectedRoute><MenuAdminComponent /></ProtectedRoute>} />
          <Route path="/Proveedores" element={<ProtectedRoute><MenuAdminProveedores /></ProtectedRoute>} />
          <Route path="/Licitaciones" element={<ProtectedRoute><MenuLicitaciones /></ProtectedRoute>} />
          <Route path="/Leyes" element={<ProtectedRoute><MenuLeyes /></ProtectedRoute>} />
          <Route path="/Ubicacion" element={<ProtectedRoute><MenuUbicacion /></ProtectedRoute>} />
          <Route path="/DocentesAdmin" element={<ProtectedRoute><MenuDocenteAdmin /></ProtectedRoute>} />
          <Route path="/Licencias" element={<ProtectedRoute><MenuAdminLicencias /></ProtectedRoute>} />
          <Route path="/MenuDocente" element={<ProtectedRoute><MenuDocente /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
