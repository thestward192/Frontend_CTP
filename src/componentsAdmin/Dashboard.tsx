import { ChartBarIcon, CogIcon, FolderIcon, HomeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/16/solid';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const location = useLocation();

    // Función para detectar la ruta activa y aplicar el estilo azul
    const getActiveClass = (path: string) => {
      return location.pathname === path ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]';
    };
  
    return (
      <div className="fixed top-0 left-0 h-screen w-[270px] rounded-tr-[10px] rounded-br-[10px] bg-white shadow-lg flex flex-col justify-between items-start p-4 z-10"> {/* Cambié el ancho de w-[220px] a w-[260px] */}
        {/* Título del menú */}
        <div className="text-[#2b3674] text-[26px] font-bold font-['Poppins'] leading-relaxed mb-6">Menu</div>
  
        {/* Separador */}
        <div className="w-full border border-[#f4f7fe] mb-4"></div>
  
        {/* Opciones del menú */}
        <div className="flex-1 w-full">
          <ul className="space-y-6">
            <li className="flex items-center text-[#a3aed0] text-base font-medium font-['DM Sans']">
              <HomeIcon className="h-6 w-6 mr-4" />
              <Link to="/MenuAdmin" className={`${getActiveClass('/MenuAdmin')} text-base font-['DM Sans']`}>Inicio</Link>
            </li>
            <li className="flex items-center text-[#a3aed0] text-base font-medium font-['DM Sans']">
              <FolderIcon className="h-6 w-6 mr-4" />
              <Link to="/gestion" className={`${getActiveClass('/gestion')} text-base font-['DM Sans']`}>Gestión</Link>
            </li>
            <li className="flex items-center text-[#a3aed0] text-base font-medium font-['DM Sans']">
              <ChartBarIcon className="h-6 w-6 mr-4" />
              <Link to="/reportes" className={`${getActiveClass('/reportes')} text-base font-['DM Sans']`}>Reportes</Link>
            </li>
            <li className="flex items-center text-[#a3aed0] text-base font-medium font-['DM Sans']">
              <CogIcon className="h-6 w-6 mr-4" />
              <Link to="/configuracion" className={`${getActiveClass('/configuracion')} text-base font-['DM Sans']`}>Configuración</Link>
            </li>
            <li className="flex items-center text-[#a3aed0] text-base font-medium font-['DM Sans']">
              <UserIcon className="h-6 w-6 mr-4" />
              <Link to="/perfil" className={`${getActiveClass('/perfil')} text-base font-['DM Sans']`}>Perfil</Link>
            </li>
          </ul>
        </div>
  
        {/* Botón de cerrar sesión */}
        <div className="w-full">
          <div className="flex items-center text-[#a3aed0] text-base font-medium font-['DM Sans']">
            <LockClosedIcon className="h-6 w-6 mr-4" />
            <Link to="/" className={`${getActiveClass('/')} text-base font-['DM Sans']`}>Cerrar Sesión</Link>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
