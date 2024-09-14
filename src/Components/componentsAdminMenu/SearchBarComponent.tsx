import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBarComponent: React.FC = () => {
  return (
    <div className="relative w-full h-[80px]"> {/* Ajustamos la altura */}
      {/* Barra de búsqueda principal */}
      <div className="absolute top-[5%] w-full flex justify-center items-center"> {/* Centramos la barra */}
        {/* Campo de búsqueda */}
        <div className="w-[700px] h-[35px] bg-white rounded-lg shadow-md border border-gray-200 flex items-center px-4">
          {/* Icono de lupa */}
          <FaSearch className="text-gray-400 mr-3" />
          <input
            className="w-full h-full p-2 text-gray-600 bg-transparent outline-none text-sm"
            type="text"
            placeholder="Buscar"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBarComponent;
