// src/componentsPages/DashboardDocente.tsx
import { HomeIcon, FolderIcon, UserIcon, LockClosedIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import ProfileModalDocente from './ProfileModalDocente';

const DashboardDocente: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Funciones para estilos activos
  const getActiveClass = (path: string) =>
    location.pathname === path ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]';
  const getIconClass = (path: string) =>
    location.pathname === path ? 'text-[#2b3674]' : 'text-[#a3aed0]';

  // Modales
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-[270px] rounded-tr-[10px] rounded-br-[10px] bg-white shadow-lg flex flex-col justify-between items-start p-4 z-10">
        {/* Título */}
        <div className="text-[#2b3674] text-[26px] font-bold font-['Poppins'] leading-relaxed mb-6">
          Menu
        </div>
        <div className="w-full border border-[#f4f7fe] mb-4" />

        {/* Enlaces */}
        <div className="flex-1 w-full">
          <ul className="space-y-6">
            <li className="flex items-center group">
              <HomeIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/MenuDocente')}`} />
              <Link to="/MenuDocente" className={`${getActiveClass('/MenuDocente')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
                Inicio
              </Link>
            </li>
            <li className="flex items-center group">
              <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/PrestamosDocente')}`} />
              <Link to="/PrestamosDocente" className={`${getActiveClass('/PrestamosDocente')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
                Préstamos
              </Link>
            </li>
            <li className="flex items-center group">
              <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/InventarioDocente')}`} />
              <Link to="/InventarioDocente" className={`${getActiveClass('/InventarioDocente')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
                Inventario
              </Link>
            </li>
            <li className="flex items-center group">
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

        {/* Cerrar Sesión */}
        <div className="w-full">
          <div className="flex items-center text-base font-['DM Sans'] group">
            <LockClosedIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/')}`} />
            <button
              type="button"
              onClick={() => setShowLogoutConfirmation(true)}
              className={`${getActiveClass('/')} group-hover:text-[#2b3674] focus:outline-none`}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Perfil Docente */}
        <ProfileModalDocente
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>

      {/* Modal de confirmación de Cerrar Sesión */}
      {showLogoutConfirmation &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-lg font-bold mb-4">Cerrar Sesión</h2>
              <p>¿Seguro de que quieres cerrar sesión?</p>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  onClick={() => {
                    // limpiar tokens o estado si es necesario
                    navigate('/');
                  }}
                >
                  Confirmar
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => setShowLogoutConfirmation(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default DashboardDocente;
