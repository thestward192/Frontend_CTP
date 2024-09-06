// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentsPages/Login';
import Register from './componentsPages/Register';
import MenuAdminComponent from './componentsAdmin/MenuAdminComponent';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/MenuAdmin" element={<MenuAdminComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
