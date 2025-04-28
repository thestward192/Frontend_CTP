// src/Components/componentsAdminImport/MenuImportAssets.tsx
import React, { useState } from 'react';
import Dashboard from '../componentsPages/Dashboard';
import Arriba from '../../assets/Arriba.png';
import SearchBarComponent from '../componentsAdminMenu/SearchBarComponent';
import ImportAssetsComponent from './ImportAssetsComponent';
import { Menu, X } from 'lucide-react';

const MenuImportAssets: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Toggle button */}
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
        <Dashboard />
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className="flex-1 relative z-10 bg-gray-100 overflow-hidden transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? '16rem' : '0' }}
      >
        {/* Background image */}
        <img
          src={Arriba}
          alt="Fondo"
          className="absolute top-0 left-0 w-full h-[414px] object-cover z-0"
        />

        <div className="relative z-10">
          {/* Search bar section */}
          <div className="pt-[40px] px-10">
            <SearchBarComponent />
          </div>

          {/* Panel “superpuesto” con margen positivo */}
          <div className="relative z-20 mt-8 ml-10 mr-10">
            <ImportAssetsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuImportAssets;
