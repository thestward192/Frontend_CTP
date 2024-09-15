import React from 'react';

interface SelectionModalProps {
  onSelectLey: () => void;
  onSelectDonacion: () => void;
  onClose: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ onSelectLey, onSelectDonacion, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"> {/* Tamaño y estilo del modal */}
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Selecciona el motivo para agregar el activo</h2>

        {/* Botones de selección */}
        <div className="flex justify-around mb-5">
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition text-sm font-medium shadow-md focus:ring focus:ring-blue-300"
            onClick={onSelectLey}
          >
            Por Ley
          </button>
          <button 
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition text-sm font-medium shadow-md focus:ring focus:ring-green-300"
            onClick={onSelectDonacion}
          >
            Por Donación
          </button>
        </div>
        
        {/* Botón de Cancelar */}
        <div className="text-center">
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-700 transition text-sm underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
