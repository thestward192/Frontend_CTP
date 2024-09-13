import { ChartBarIcon, CogIcon, FolderIcon, HomeIcon, LockClosedIcon, UserIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [isGestionOpen, setIsGestionOpen] = useState(false); // Estado para el acordeón de Gestión

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
            <HomeIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/MenuAdmin')}`} />
            <Link to="/MenuAdmin" className={`${getActiveClass('/MenuAdmin')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>Inicio</Link>
          </li>

          {/* Gestión con acordeón */}
          <li>
            <div
              className="flex items-center text-base font-['DM Sans'] cursor-pointer group"
              onClick={() => setIsGestionOpen(!isGestionOpen)} // Toggle acordeón
            >
              <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/gestion')}`} />
              <span className={`${getActiveClass('/gestion')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>Gestión</span>
              {isGestionOpen ? (
                <ChevronUpIcon className="h-4 w-4 ml-auto group-hover:text-[#2b3674]" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 ml-auto group-hover:text-[#2b3674]" />
              )}
            </div>

            {/* Submenú en estilo acordeón */}
            {isGestionOpen && (
              <ul className="ml-11 mt-2 space-y-3"> {/* Ajustamos ml-8 para mover el submenú más a la derecha */}
              <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Licencias" className={`${getActiveClass('/Licencias')} group-hover:text-[#2b3674]`}>Licencias</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Proveedores" className={`${getActiveClass('/Proveedores')} group-hover:text-[#2b3674]`}>Proveedores</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Licitaciones" className={`${getActiveClass('/Licitaciones')} group-hover:text-[#2b3674]`}>Licitaciones</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Leyes" className={`${getActiveClass('/Leyes')} group-hover:text-[#2b3674]`}>Leyes</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Ubicacion" className={`${getActiveClass('/Ubicacion')} group-hover:text-[#2b3674]`}>Ubicaciones</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/DocentesAdmin" className={`${getActiveClass('/DocentesAdmin')} group-hover:text-[#2b3674]`}>Docentes</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="flex items-center text-base font-['DM Sans'] group">
            <ChartBarIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/reportes')}`} />
            <Link to="/reportes" className={`${getActiveClass('/reportes')} group-hover:text-[#2b3674]`}>Reportes</Link>
          </li>
          <li className="flex items-center text-base font-['DM Sans'] group">
            <CogIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/configuracion')}`} />
            <Link to="/configuracion" className={`${getActiveClass('/configuracion')} group-hover:text-[#2b3674]`}>Configuración</Link>
          </li>
          <li className="flex items-center text-base font-['DM Sans'] group">
            <UserIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/perfil')}`} />
            <Link to="/perfil" className={`${getActiveClass('/perfil')} group-hover:text-[#2b3674]`}>Perfil</Link>
          </li>
        </ul>
      </div>

      {/* Botón de cerrar sesión */}
      <div className="w-full">
        <div className="flex items-center text-base font-['DM Sans'] group">
          <LockClosedIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/')}`} />
          <Link to="/" className={`${getActiveClass('/')} group-hover:text-[#2b3674]`}>Cerrar Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
