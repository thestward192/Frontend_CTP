import React from 'react';
import Dashboard from '../componentsPages/Dashboard';
import Arriba from '../../assets/Arriba.png';
import SearchBarComponent from '../componentsAdminMenu/SearchBarComponent';
import DocentesComponent from './DocentesComponent';

const MenuDocenteAdmin: React.FC = () => {
  return (
    <div className="relative w-full h-screen flex">
      {/* Sidebar */}
      <div className="z-10 w-[270px]"> {/* Aumentamos un poco el ancho del sidebar para eliminar el espacio */}
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
          {/* Espaciado superior para buscadores */}
          <div className="pt-[40px] px-10"> {/* Reducimos el padding-top para subir los buscadores */}
            {/* Elementos de búsqueda */}
            <SearchBarComponent />
          </div>

          {/* Tabla con márgenes laterales */}
          <div className="relative z-20 -mt-6 ml-10 mr-10"> {/* Reducimos el margen superior de la tabla */}
            <DocentesComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDocenteAdmin;
