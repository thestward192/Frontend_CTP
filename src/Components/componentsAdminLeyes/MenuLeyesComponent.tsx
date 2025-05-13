import React, { useState } from 'react';
import Dashboard from '../componentsPages/Dashboard';
import Arriba from '../../assets/Arriba.png';
import LeyesComponent from './LeyesComponent';
import SearchBarComponent from '../componentsAdminMenu/SearchBarComponent';
import { Menu, X } from 'lucide-react';

const MenuLeyes: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddingLey, setIsAddingLey] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Callback para iniciar o cerrar el flujo de "Agregar Ley"
  const handleAddLey = (isAdding: boolean) => {
    setIsAddingLey(isAdding);
    if (isAdding) {
      // Al iniciar, ocultamos el sidebar para que el contenido se expanda
      setIsSidebarOpen(false);
    } else {
      // Al cerrar el formulario, volvemos a mostrar el sidebar
      setIsSidebarOpen(true);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
        <Dashboard />
      </div>

      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
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
          {/* Sección de búsqueda */}
          <div className="pt-[40px] px-10">
            <SearchBarComponent onSearch={handleSearch} />
          </div>

          {/* Contenedor de LeyesComponent */}
          <div className="relative z-20 -mt-6 ml-10 mr-10">
            {/* Se pasa el callback para el flujo de agregar ley */}
            <LeyesComponent onAddLey={handleAddLey} searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuLeyes;
