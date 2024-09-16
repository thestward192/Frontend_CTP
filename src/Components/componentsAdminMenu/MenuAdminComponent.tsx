import React, { useState } from 'react';
import SearchBarComponent from './SearchBarComponent';
import TableComponent from './TableComponent';
import Dashboard from '../componentsPages/Dashboard';
import Arriba from '../../assets/Arriba.png';
import ProfileComponent from '../componentsPages/ProfileComponent';

const MenuAdminComponent: React.FC = () => {
  const [isAssetSelected, setIsAssetSelected] = useState(false); // Controla si se ha seleccionado un activo

  // Nombre, correo y tipo de usuario (puedes ajustarlo según tu lógica de usuario actual)
  const username = 'Hezron'; // Nombre del usuario
  const email = 'hezron@example.com'; // Correo del usuario
  const userType = 'Administrador'; // Tipo de usuario

  return (
    <div className="relative w-full h-screen flex">
      {/* Sidebar */}
      <div className="z-10 w-[270px]">
        <Dashboard />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {/* Imagen de fondo */}
        <img
          src={Arriba}
          alt="Fondo"
          className="absolute top-0 left-0 w-full h-[414px] object-cover z-0"
        />

        <div className="relative z-10">
          {/* Componente de Perfil */}
          <div className="absolute top-4 right-6">
            <ProfileComponent username={username} email={email} userType={userType} />
          </div>

          {/* Solo mostramos el buscador si no hay un activo seleccionado */}
          {!isAssetSelected && (
            <div className="pt-[40px] px-10">
              <SearchBarComponent />
            </div>
          )}

          {/* Tabla con márgenes laterales */}
          <div className="relative z-20 ml-10 mr-10" style={{ marginTop: isAssetSelected ? '30px' : '-30px' }}>
            <TableComponent onAssetSelect={setIsAssetSelected} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuAdminComponent;
