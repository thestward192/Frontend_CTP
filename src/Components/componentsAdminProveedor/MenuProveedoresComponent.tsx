import React, { useState } from 'react';
import Dashboard from '../componentsPages/Dashboard';
import Arriba from '../../assets/Arriba.png';
import ProveedoresComponent from './ProveedoresComponent';
import SearchBarComponent from '../componentsAdminMenu/SearchBarComponent';
import { Menu, X } from 'lucide-react';

const MenuAdminProveedores: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddingProveedor, setIsAddingProveedor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProveedor = (isAdding: boolean) => {
    setIsAddingProveedor(isAdding);
    if (isAdding) {
      setIsSidebarOpen(false);
    } else {
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
        className={`flex-1 relative z-10 bg-gray-100 overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-[16rem]' : 'md:ml-0'
        }`}
      >
        {/* Imagen de fondo */}
        <img
          src={Arriba}
          alt="Fondo"
          className="absolute top-0 left-0 w-full h-[414px] object-cover z-0"
        />

        <div className="relative z-10">
          {/* Sección de búsqueda */}          <div className="pt-[40px] px-10">
            <SearchBarComponent onSearch={setSearchTerm} />
          </div>

          {/* Contenedor de ProveedoresComponent */}
          <div className="relative z-20 -mt-6 ml-10 mr-10">
            <ProveedoresComponent onAddProveedor={handleAddProveedor} searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuAdminProveedores;
