import React, { useState } from 'react';
import Dashboard from '../componentsPages/Dashboard';
import Arriba from '../../assets/Arriba.png';
import LicenciasComponent from './LicenciasComponent';
import SearchBarComponent from '../componentsAdminMenu/SearchBarComponent';
import { Menu, X } from 'lucide-react';

const MenuLicencias: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddingLicencia, setIsAddingLicencia] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Esta función se invoca desde LicenciasComponent cuando se activa o cierra el flujo de "Agregar Licencia"
  const handleAddLicencia = (isAdding: boolean) => {
    setIsAddingLicencia(isAdding);
    if (isAdding) {
      // Al agregar licencia, cerramos el sidebar para que el contenido se expanda
      setIsSidebarOpen(false);
    } else {
      // Cuando se cierra el modal, se vuelve a mostrar el sidebar (si se desea)
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Botón toggle, siempre visible */}
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

      {/* Contenido principal: se expande a 100% de ancho cuando el sidebar está cerrado */}
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
            <SearchBarComponent 
              onSearch={setSearchTerm}
              placeholder="Buscar por No. Identificador o Nombre..."
            />
          </div>

          {/* Contenedor de LicenciasComponent */}
          <div className="relative z-20 -mt-6 ml-10 mr-10">
            <LicenciasComponent 
              onAddLicencia={handleAddLicencia}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuLicencias;
