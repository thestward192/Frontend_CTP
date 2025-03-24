import { ChartBarIcon, CogIcon, FolderIcon, HomeIcon, LockClosedIcon, UserIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const location = useLocation();

  // Memorizar las rutas pertenecientes a cada acordeón para evitar re-ejecución constante del useEffect
  const gestionPaths = useMemo(() => ["/Leyes", "/Proveedores", "/Licitaciones", "/Ubicacion", "/DocentesAdmin"], []);
  const reportesPaths = useMemo(() => ["/ReportesPrestamos"], []);

  // Estado inicial según la ruta actual (evita efecto de "flicker" en el primer render)
  const initialAccordion = gestionPaths.includes(location.pathname)
    ? 'gestion'
    : reportesPaths.includes(location.pathname)
    ? 'reportes'
    : null;
  const [openAccordion, setOpenAccordion] = useState<string | null>(initialAccordion);

  // Actualiza el acordeón abierto solo cuando la ruta cambia
  useEffect(() => {
    if (gestionPaths.includes(location.pathname)) {
      setOpenAccordion('gestion');
    } else if (reportesPaths.includes(location.pathname)) {
      setOpenAccordion('reportes');
    } else {
      // Si se navega a una ruta externa, se cierra el acordeón,
      // pero esto solo se ejecuta cuando cambia location.pathname
      setOpenAccordion(null);
    }
  }, [location.pathname, gestionPaths, reportesPaths]);

  // Permite abrir/cerrar manualmente el acordeón
  const toggleAccordion = (section: string) => {
    setOpenAccordion(prev => (prev === section ? null : section));
  };

  // Función para aplicar estilos según la ruta activa
  const getActiveClass = (path: string) => {
    return location.pathname === path ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]';
  };

  // Función para el color de los íconos
  const getIconClass = (path: string) => {
    return location.pathname === path ? 'text-[#2b3674]' : 'text-[#a3aed0]';
  };

  // Determina si la ruta actual pertenece a cada acordeón
  const isGestionActive = gestionPaths.includes(location.pathname);
  const isReportesActive = reportesPaths.includes(location.pathname);

  return (
    <div className="fixed top-0 left-0 h-screen w-full md:w-[270px] rounded-tr-[10px] rounded-br-[10px] bg-white shadow-lg flex flex-col justify-between items-start p-4 z-10">
      {/* Título del menú */}
      <div className="text-[#2b3674] text-[26px] font-bold font-['Poppins'] leading-relaxed mb-6">Menu</div>

      {/* Separador */}
      <div className="w-full border border-[#f4f7fe] mb-4"></div>

      {/* Opciones del menú */}
      <div className="flex-1 w-full">
        <ul className="space-y-6">
          <li className="flex items-center text-base font-['DM Sans'] group">
            <HomeIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/MenuAdmin')}`} />
            <Link to="/MenuAdmin" className={`${getActiveClass('/MenuAdmin')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Activos
            </Link>
          </li>

          {/* Sección Licencias */}
          <li className="flex items-center text-base font-['DM Sans'] group">
            <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/Licencias')}`} />
            <Link to="/Licencias" className={`${getActiveClass('/Licencias')} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
              Licencias
            </Link>
          </li>

          {/* Acordeón Gestión */}
          <li>
            <div className="flex items-center text-base font-['DM Sans'] cursor-pointer group" onClick={() => toggleAccordion('gestion')}>
              <FolderIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/gestion')}`} />
              <span className={`${isGestionActive ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]'} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
                Gestión
              </span>
              {openAccordion === 'gestion' ? (
                <ChevronUpIcon className="h-4 w-4 ml-auto group-hover:text-[#2b3674]" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 ml-auto group-hover:text-[#2b3674]" />
              )}
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'gestion' ? 'max-h-96' : 'max-h-0'}`}>
              <ul className="ml-11 mt-2 space-y-3">
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Leyes" className={`${getActiveClass('/Leyes')} group-hover:text-[#2b3674]`}>Leyes</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Proveedores" className={`${getActiveClass('/Proveedores')} group-hover:text-[#2b3674]`}>Proveedores</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Licitaciones" className={`${getActiveClass('/Licitaciones')} group-hover:text-[#2b3674]`}>Licitaciones</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/Ubicacion" className={`${getActiveClass('/Ubicacion')} group-hover:text-[#2b3674]`}>Ubicaciones</Link>
                </li>
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  {/* Se mantiene la ruta original, solo se cambia el texto visual */}
                  <Link to="/DocentesAdmin" className={`${getActiveClass('/DocentesAdmin')} group-hover:text-[#2b3674]`}>Usuarios</Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Acordeón Reportes */}
          <li>
            <div className="flex items-center text-base font-['DM Sans'] cursor-pointer group" onClick={() => toggleAccordion('reportes')}>
              <ChartBarIcon className={`h-6 w-6 mr-4 group-hover:text-[#2b3674] ${getIconClass('/reportes')}`} />
              <span className={`${isReportesActive ? 'text-[#2b3674] font-bold' : 'text-[#a3aed0]'} text-base font-['DM Sans'] group-hover:text-[#2b3674]`}>
                Reportes
              </span>
              {openAccordion === 'reportes' ? (
                <ChevronUpIcon className="h-4 w-4 ml-auto group-hover:text-[#2b3674]" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 ml-auto group-hover:text-[#2b3674]" />
              )}
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'reportes' ? 'max-h-96' : 'max-h-0'}`}>
              <ul className="ml-11 mt-2 space-y-3">
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/ReportesPrestamos" className={`${getActiveClass('/ReportesPrestamos')} group-hover:text-[#2b3674]`}>Reportes Préstamos</Link>
                </li>
              </ul>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'reportes' ? 'max-h-96' : 'max-h-0'}`}>
              <ul className="ml-11 mt-2 space-y-3">
                <li className="flex items-center text-sm font-['DM Sans'] group">
                  <Link to="/ReportesInventario" className={`${getActiveClass('/ReportesInventario')} group-hover:text-[#2b3674]`}>Reportes Inventario</Link>
                </li>
              </ul>
            </div>
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
