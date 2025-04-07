import React, { useState } from 'react';
import Arriba from '../../assets/Arriba.png';
import DashboardDocente from '../componentsPagesDocente/DashboardDocentes';
import SearchBarDocente from '../componentsPagesDocente/SearchBarDocente';
import ProfileDocenteComponent from '../componentsPagesDocente/PerfileDocenteComponent';
import TableInventarioDocente from './TableInventarioDocente';
import { Menu, X } from 'lucide-react';

const MenuInventarioDocente: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddingInventario, setIsAddingInventario] = useState(false);

  // Callback para iniciar o cerrar el flujo de "Hacer Inventario"
  const handleAddInventario = (isAdding: boolean) => {
    setIsAddingInventario(isAdding);
    if (isAdding) {
      // Oculta el sidebar al iniciar el inventario
      setIsSidebarOpen(false);
    } else {
      // Al cerrar el modal, vuelve a mostrar el sidebar
      setIsSidebarOpen(true);
    }
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
          fixed inset-y-0 left-0 z-40 bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out
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
        ></div>
      )}

      {/* Contenido principal: en desktop se aplica margen izquierdo si el sidebar está abierto */}
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
            <SearchBarDocente />
          </div>

          {/* Contenedor de TableInventarioDocente */}
          <div className="relative z-20 -mt-6 ml-10 mr-10">
            <TableInventarioDocente onAddInventario={handleAddInventario} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuInventarioDocente;
