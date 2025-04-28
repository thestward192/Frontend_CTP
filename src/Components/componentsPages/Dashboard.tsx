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
import { Link, useLocation } from 'react-router-dom';
import ProfileModal from './ProfileModal';

const Dashboard: React.FC = () => {
  const location = useLocation();

  // Rutas que abren cada acordeón
  const gestionPaths = useMemo(
    () => ['/Leyes', '/Proveedores', '/Licitaciones', '/Ubicacion', '/DocentesAdmin'],
    []
  );
  const reportesPaths = useMemo(
    () => ['/ReportesPrestamos', '/ReportesInventario'],
    []
  );

  // Estado del acordeón según la ruta actual
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
  }, [location.pathname, gestionPaths, reportesPaths]);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(prev => (prev === section ? null : section));
  };

  const getActiveClass = (path: string) =>
    location.pathname === path ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]';

  const getIconClass = (path: string) =>
    location.pathname === path ? 'text-[#2b3674]' : 'text-[#a3aed0]';

  const isGestionActive = gestionPaths.includes(location.pathname);
  const isReportesActive = reportesPaths.includes(location.pathname);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 h-screen w-full md:w-[270px] rounded-tr-[10px] rounded-br-[10px] bg-white shadow-lg flex flex-col justify-between p-4 z-10">
      {/* Título */}
      <div className="text-[#2b3674] text-[26px] font-bold mb-6">Menu</div>
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

          {/* Acordeón Gestión */}
          <li>
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => toggleAccordion('gestion')}
            >
              <FolderIcon className={`h-6 w-6 mr-4 ${getIconClass('/gestion')}`} />
              <span className={isGestionActive ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]'}>
                Gestión
              </span>
              {openAccordion === 'gestion' ? (
                <ChevronUpIcon className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 ml-auto" />
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openAccordion === 'gestion' ? 'max-h-60' : 'max-h-0'
              }`}
            >
              <ul className="ml-10 mt-2 space-y-3">
                <li>
                  <Link to="/Leyes" className={getActiveClass('/Leyes')}>
                    Leyes
                  </Link>
                </li>
                <li>
                  <Link to="/Proveedores" className={getActiveClass('/Proveedores')}>
                    Proveedores
                  </Link>
                </li>
                <li>
                  <Link to="/Licitaciones" className={getActiveClass('/Licitaciones')}>
                    Licitaciones
                  </Link>
                </li>
                <li>
                  <Link to="/Ubicacion" className={getActiveClass('/Ubicacion')}>
                    Ubicaciones
                  </Link>
                </li>
                <li>
                  <Link to="/DocentesAdmin" className={getActiveClass('/DocentesAdmin')}>
                    Usuarios
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Acordeón Reportes */}
          <li>
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => toggleAccordion('reportes')}
            >
              <ChartBarIcon className={`h-6 w-6 mr-4 ${getIconClass('/reportes')}`} />
              <span className={isReportesActive ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]'}>
                Reportes
              </span>
              {openAccordion === 'reportes' ? (
                <ChevronUpIcon className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 ml-auto" />
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openAccordion === 'reportes' ? 'max-h-40' : 'max-h-0'
              }`}
            >
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

          {/* Importar Activos (fuera de acordeón, antes de Perfil) */}
          <li className="flex items-center group">
            <FolderIcon className={`h-6 w-6 mr-4 ${getIconClass('/ImportarActivos')}`} />
            <Link to="/ImportarActivos" className={getActiveClass('/ImportarActivos')}>
              Importar Activos
            </Link>
          </li>

          {/* Perfil */}
          <li className="flex items-center group">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center"
            >
              <UserIcon className={`h-6 w-6 mr-4 ${getIconClass('/perfil')}`} />
              <span className={getActiveClass('/perfil')}>Perfil</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Cerrar sesión */}
      <div className="w-full mt-auto">
        <div className="flex items-center group">
          <LockClosedIcon className={`h-6 w-6 mr-4 ${getIconClass('/')}`} />
          <Link to="/" className={getActiveClass('/')}>
            Cerrar Sesión
          </Link>
        </div>
      </div>

      {/* Modal de Perfil */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
