import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarComponentProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({ onSearch, placeholder = "Buscar..." }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full h-[80px]">
      <div className="absolute top-[5%] w-full flex justify-center items-center">
        <div className="w-[700px] h-[35px] bg-white rounded-lg shadow-md border border-gray-200 flex items-center px-4">
          <FaSearch className="text-gray-400 mr-3" />
          <input            
            className="w-full h-full p-2 text-gray-600 bg-transparent outline-none text-sm"
            type="text"
            placeholder={placeholder}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBarComponent;
