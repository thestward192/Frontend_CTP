import { HomeIcon, FolderIcon, UserIcon, LockClosedIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileModalDocente from './ProfileModalDocente';

const DashboardDocente: React.FC = () => {
  const location = useLocation();

  // Función para asignar estilos según la ruta activa
  const getActiveClass = (path: string) => {
    return location.pathname === path ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]';
  };

  const getIconClass = (path: string) => {
    return location.pathname === path ? 'text-[#2b3674]' : 'text-[#a3aed0]';
  };

  // Estado para controlar la apertura del modal de perfil docente
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
            <HomeIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/MenuDocente')}`} />
            <Link to="/MenuDocente" className={`${getActiveClass('/MenuDocente')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Inicio
            </Link>
          </li>
          <li className="flex items-center text-base font-['DM Sans'] group">
            <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/PrestamosDocente')}`} />
            <Link to="/PrestamosDocente" className={`${getActiveClass('/PrestamosDocente')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Préstamos
            </Link>
          </li>
          <li className="flex items-center text-base font-['DM Sans'] group">
            <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/InventarioDocente')}`} />
            <Link to="/InventarioDocente" className={`${getActiveClass('/InventarioDocente')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Inventario
            </Link>
          </li>
          {/* Opción Perfil: abre el modal en lugar de navegar */}
          <li className="flex items-center text-base font-['DM Sans'] group">
            <UserIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/docente/perfil')}`} />
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className={`${getActiveClass('/docente/perfil')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}
            >
              Perfil
            </button>
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
      {/* Modal de Perfil Docente */}
      <ProfileModalDocente isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};

export default DashboardDocente;
