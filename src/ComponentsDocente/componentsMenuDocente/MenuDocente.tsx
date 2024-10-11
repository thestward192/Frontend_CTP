import React from 'react';
import Arriba from '../../assets/Arriba.png';
import DashboardDocente from '../componentsPagesDocente/DashboardDocentes';
import SearchBarDocente from '../componentsPagesDocente/SearchBarDocente';
import TableComponentDocente from './TableComponentDocente';
import ProfileDocenteComponent from '../componentsPagesDocente/PerfileDocenteComponent';

const MenuDocente: React.FC = () => {
  return (
    <div className="relative w-full h-screen flex">
      {/* Sidebar */}
      <div className="z-10 w-[270px]">
        <DashboardDocente />
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
          {/* Perfil del Docente */}
          <div className="absolute top-4 right-6">
            <ProfileDocenteComponent />
          </div>

          {/* Espaciado superior para buscadores */}
          <div className="pt-[20px] px-10"> {/* Reducimos el padding-top */}
            <SearchBarDocente />
          </div>

          {/* Tabla con márgenes laterales */}
          <div className="relative z-20 -mt-6 ml-10 mr-10">
            <TableComponentDocente />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDocente;
