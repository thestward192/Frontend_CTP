// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Componets/componentsPages/Login';
import Register from './Componets/componentsPages/Register';
import MenuAdminComponent from './Componets/componentsAdminMenu/MenuAdminComponent';
import MenuAdminProveedores from './Componets/componentsAdminProveedor/MenuProveedoresComponent';
import MenuLicitaciones from './Componets/componentsAdminLicitaciones/MenuLicitaciones';
import MenuLeyes from './Componets/componentsAdminLeyes/MenuLeyesComponent';
import MenuUbicacion from './Componets/componentsAdminUbicaciones/MenuUbicacionesComponent';
import MenuDocenteAdmin from './Componets/componentsAdminDocentes/MenuDocentesComponent';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/MenuAdmin" element={<MenuAdminComponent />} />
        <Route path="/Proveedores" element={<MenuAdminProveedores />} />
        <Route path="/Licitaciones" element={<MenuLicitaciones />} />
        <Route path="/Leyes" element={<MenuLeyes />} />
        <Route path="/Ubicacion" element={<MenuUbicacion />} />
        <Route path="/DocentesAdmin" element={<MenuDocenteAdmin />} />


      </Routes>
    </Router>
  );
};

export default App;
