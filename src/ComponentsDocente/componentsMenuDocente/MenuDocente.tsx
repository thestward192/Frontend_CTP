// src/pages/MenuDocente.tsx

import React, { useState } from 'react';
import Arriba from '../../assets/Arriba.png';
import SearchBarDocente from '../componentsPagesDocente/SearchBarDocente';
import TableComponentDocente from './TableComponentDocente';
import ProfileDocenteComponent from '../componentsPagesDocente/PerfileDocenteComponent';
import { Menu, X } from 'lucide-react';
import DashboardDocente from '../componentsPagesDocente/DashboardDocentes';

const MenuDocente: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');  // ← Nuevo estado para el término de búsqueda

  // Función para actualizar el estado del sidebar según si se muestra el detalle
  const handleDetailToggle = (isDetailOpen: boolean) => {
    // Si el detalle se abre, ocultamos el sidebar; si se cierra, lo mostramos nuevamente.
    setIsSidebarOpen(!isDetailOpen);
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Botón toggle */}
      <button
        className="absolute top-16 left-4 z-50 p-1 bg-gray-800 text-white rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 bg-white shadow-lg w-64 
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <DashboardDocente />
      </div>

      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div
        className="flex-1 relative z-10 bg-gray-100 overflow-hidden transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? '16rem' : '0' }}
      >
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

          {/* Sección de búsqueda */}
          <div className="pt-[40px] px-10">
            <SearchBarDocente
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />
          </div>

          {/* Contenedor de TableComponentDocente */}
          <div className="relative z-20 -mt-6 ml-10 mr-10">
            <TableComponentDocente
              searchTerm={searchTerm}
              onDetailToggle={handleDetailToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDocente;
