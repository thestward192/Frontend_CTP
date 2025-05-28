// src/componentsPagesDocente/SearchBarDocente.tsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

const SearchBarDocente: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="relative w-full h-[130px]">
      <div className="absolute top-[5%] w-full flex flex-col items-center justify-center">
        <div className="w-[700px] h-[35px] bg-white rounded-lg shadow-md border border-gray-200 flex items-center px-4">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            className="w-full h-full p-2 text-gray-600 bg-transparent outline-none text-sm"
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBarDocente;
