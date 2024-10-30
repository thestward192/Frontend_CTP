import { HomeIcon, FolderIcon, UserIcon, LockClosedIcon } from '@heroicons/react/16/solid';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardDocente: React.FC = () => {
  const location = useLocation();

  // Función para detectar la ruta activa y aplicar el estilo azul
  const getActiveClass = (path: string) => {
    return location.pathname === path ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]';
  };

  // Función para aplicar el color de los íconos cuando están seleccionados
  const getIconClass = (path: string) => {
    return location.pathname === path ? 'text-[#2b3674]' : 'text-[#a3aed0]';
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[270px] rounded-tr-[10px] rounded-br-[10px] bg-white shadow-lg flex flex-col justify-between items-start p-4 z-10">
      {/* Título del menú */}
      <div className="text-[#2b3674] text-[26px] font-bold font-['Poppins'] leading-relaxed mb-6">Menu</div>

      {/* Separador */}
      <div className="w-full border border-[#f4f7fe] mb-4"></div>

      {/* Opciones del menú */}
      <div className="flex-1 w-full">
        <ul className="space-y-6">
          <li className="flex items-center text-base font-['DM Sans'] group">
            <HomeIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/docente/inicio')}`} />
            <Link to="/docente/inicio" className={`${getActiveClass('/docente/inicio')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Inicio
            </Link>
          </li>
          <li className="flex items-center text-base font-['DM Sans'] group">
            <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/docente/prestamos')}`} />
            <Link to="/docente/prestamos" className={`${getActiveClass('/docente/prestamos')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Préstamos
            </Link>
          </li>
          <li className="flex items-center text-base font-['DM Sans'] group">
            <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/docente/inventario')}`} />
            <Link to="/docente/inventario" className={`${getActiveClass('/docente/inventario')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Inventario
            </Link>
          </li>
          <li className="flex items-center text-base font-['DM Sans'] group">
            <UserIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/docente/perfil')}`} />
            <Link to="/docente/perfil" className={`${getActiveClass('/docente/perfil')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Perfil
            </Link>
          </li>
        </ul>
      </div>

      {/* Botón de cerrar sesión */}
      <div className="w-full">
        <div className="flex items-center text-base font-['DM Sans'] group">
          <LockClosedIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/')}`} />
          <Link to="/" className={`${getActiveClass('/')} group-hover:text-[#2b3674]`}>
            Cerrar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardDocente;
