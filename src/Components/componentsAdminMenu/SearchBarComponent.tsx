import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBarComponent: React.FC = () => {
  return (
    <div className="relative w-full h-[130px]"> {/* Reducimos la altura general para subir el buscador */}
      {/* Barra de búsqueda principal */}
      <div className="absolute top-[5%] w-full flex flex-col items-center justify-center"> {/* Ajustamos para subir más los buscadores */}
        {/* Campo de búsqueda */}
        <div className="w-[700px] h-[35px] bg-white rounded-lg shadow-md border border-gray-200 flex items-center px-4 mb-6">
          {/* Icono de lupa */}
          <FaSearch className="text-gray-400 mr-3" />
          <input
            className="w-full h-full p-2 text-gray-600 bg-transparent outline-none text-sm"
            type="text"
            placeholder="Buscar "
          />
        </div>

        {/* Filtros de búsqueda */}
        <div className="flex justify-center space-x-12">
          <div className="relative">
            <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
              <option>Buscar Por Leyes</option>
            </select>
          </div>
          
          <div className="relative">
            <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
              <option>Buscar Por Ubicación</option>
            </select>
            
          </div>

          <div className="relative">
            <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
              <option>Buscar Por Proveedor</option>
            </select>
          </div>

          <div className="relative">
            <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
              <option>Buscar Por Licitación</option>
            </select>
          </div>

          <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
            <option>Buscar Por Fecha</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBarComponent;
