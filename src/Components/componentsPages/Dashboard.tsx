// src/componentsPages/Dashboard.tsx
import {
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  LockClosedIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/16/solid';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import ProfileModal from './ProfileModal';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Acordeones ---
  const gestionPaths = useMemo(
    () => ['/Leyes', '/Proveedores', '/Licitaciones', '/Ubicacion', '/DocentesAdmin'],
    []
  );
  const reportesPaths = useMemo(
    () => ['/ReportesPrestamos', '/ReportesInventario'],
    []
  );
  const initialAccordion = gestionPaths.includes(location.pathname)
    ? 'gestion'
    : reportesPaths.includes(location.pathname)
    ? 'reportes'
    : null;
  const [openAccordion, setOpenAccordion] = useState<string | null>(initialAccordion);
  useEffect(() => {
    if (gestionPaths.includes(location.pathname)) setOpenAccordion('gestion');
    else if (reportesPaths.includes(location.pathname)) setOpenAccordion('reportes');
    else setOpenAccordion(null);
  }, [location.pathname]);
  const toggleAccordion = (section: string) =>
    setOpenAccordion(prev => (prev === section ? null : section));
  const getActiveClass = (path: string) =>
    location.pathname === path ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]';
  const getIconClass = (path: string) =>
    location.pathname === path ? 'text-[#2b3674]' : 'text-[#a3aed0]';

  // --- Modales ---
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen md:w-[270px] w-full rounded-tr-[10px] rounded-br-[10px] bg-white shadow-lg flex flex-col justify-between p-4 z-10">
        <div>
          <h1 className="text-[#2b3674] text-[26px] font-bold mb-6">Menu</h1>
          <div className="w-full border border-[#f4f7fe] mb-4" />
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-6">
              {/* Activos */}
              <li className="flex items-center group">
                <HomeIcon className={`h-6 w-6 mr-4 ${getIconClass('/MenuAdmin')}`} />
                <Link to="/MenuAdmin" className={getActiveClass('/MenuAdmin')}>
                  Activos
                </Link>
              </li>
              {/* Licencias */}
              <li className="flex items-center group">
                <FolderIcon className={`h-6 w-6 mr-4 ${getIconClass('/Licencias')}`} />
                <Link to="/Licencias" className={getActiveClass('/Licencias')}>
                  Licencias
                </Link>
              </li>
              {/* Gestión */}
              <li>
                <div
                  className="flex items-center cursor-pointer group"
                  onClick={() => toggleAccordion('gestion')}
                >
                  <FolderIcon className={`h-6 w-6 mr-4 ${getIconClass('/gestion')}`} />
                  <span className={openAccordion === 'gestion' ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]'}>
                    Gestión
                  </span>
                  {openAccordion === 'gestion' ? (
                    <ChevronUpIcon className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 ml-auto" />
                  )}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'gestion' ? 'max-h-60' : 'max-h-0'}`}>
                  <ul className="ml-10 mt-2 space-y-3">
                    <li>
                      <Link to="/Leyes" className={getActiveClass('/Leyes')}>Leyes</Link>
                    </li>
                    <li>
                      <Link to="/Proveedores" className={getActiveClass('/Proveedores')}>Proveedores</Link>
                    </li>
                    <li>
                      <Link to="/Licitaciones" className={getActiveClass('/Licitaciones')}>Licitaciones</Link>
                    </li>
                    <li>
                      <Link to="/Ubicacion" className={getActiveClass('/Ubicacion')}>Ubicaciones</Link>
                    </li>
                    <li>
                      <Link to="/DocentesAdmin" className={getActiveClass('/DocentesAdmin')}>Usuarios</Link>
                    </li>
                  </ul>
                </div>
              </li>
              {/* Reportes */}
              <li>
                <div
                  className="flex items-center cursor-pointer group"
                  onClick={() => toggleAccordion('reportes')}
                >
                  <ChartBarIcon className={`h-6 w-6 mr-4 ${getIconClass('/reportes')}`} />
                  <span className={openAccordion === 'reportes' ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]'}>
                    Reportes
                  </span>
                  {openAccordion === 'reportes' ? (
                    <ChevronUpIcon className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 ml-auto" />
                  )}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'reportes' ? 'max-h-40' : 'max-h-0'}`}>
                  <ul className="ml-10 mt-2 space-y-3">
                    <li>
                      <Link to="/ReportesPrestamos" className={getActiveClass('/ReportesPrestamos')}>
                        Reportes Préstamos
                      </Link>
                    </li>
                    <li>
                      <Link to="/ReportesInventario" className={getActiveClass('/ReportesInventario')}>
                        Reportes Inventario
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              {/* Importar Activos */}
              <li className="flex items-center group">
                <FolderIcon className={`h-6 w-6 mr-4 ${getIconClass('/ImportarActivos')}`} />
                <Link to="/ImportarActivos" className={getActiveClass('/ImportarActivos')}>
                  Importar Activos
                </Link>
              </li>
              {/* Perfil */}
              <li className="flex items-center group">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center focus:outline-none"
                >
                  <UserIcon className={`h-6 w-6 mr-4 ${getIconClass('/perfil')}`} />
                  <span className={getActiveClass('/perfil')}>Perfil</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Cerrar sesión */}
        <div className="w-full mt-auto">
          <div className="flex items-center group">
            <LockClosedIcon className={`h-6 w-6 mr-4 ${getIconClass('/')}`} />
            <button
              onClick={() => setShowLogoutConfirmation(true)}
              className="text-[#a3aed0] hover:text-[#2b3674] focus:outline-none"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Modal de Perfil */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>

      {/* Modal de confirmación de Cerrar Sesión (portal) */}
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
                    // limpia tokens o estado si es necesario
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

export default Dashboard;
