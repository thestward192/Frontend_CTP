// src/App.tsx
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
