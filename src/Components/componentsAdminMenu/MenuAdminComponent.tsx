import React, { useState } from 'react';
import SearchBarComponent from './SearchBarComponent';
import TableComponent from './TableComponent';
import Dashboard from '../componentsPages/Dashboard';
import Arriba from '../../assets/Arriba.png';
import { Menu, X } from 'lucide-react';

const MenuAdminComponent: React.FC = () => {
  const [isAssetSelected, setIsAssetSelected] = useState(false);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddAsset = (isAdding: boolean) => {
    setIsAddingAsset(isAdding);
    if (isAdding) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  // Nueva función para manejar la visibilidad del sidebar cuando se abre/cierra el detalle
  const handleAssetDetailVisibility = (isDetailOpen: boolean) => {
    setIsAssetSelected(isDetailOpen);
    setIsSidebarOpen(!isDetailOpen);
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
          {/* Perfil y barra de búsqueda */}
          {!isAssetSelected && (
            <>
              <div className="pt-[40px] px-10">
                <SearchBarComponent onSearch={handleSearch} />
              </div>
            </>
          )}          {/* Contenedor de la tabla */}
          <div className="relative z-20 -mt-6 ml-10 mr-10">
            <TableComponent
              onAssetSelect={handleAssetDetailVisibility}
              onAddAsset={handleAddAsset}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuAdminComponent;
