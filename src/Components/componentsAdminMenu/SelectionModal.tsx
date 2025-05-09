import React from 'react';
import escudo from '../../assets/images-removebg-preview (1).png';

interface SelectionModalProps {
  onSelectLey: () => void;
  onSelectDonacion: () => void;
  onClose: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  onSelectLey,
  onSelectDonacion,
  onClose
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
        {/* Botón de cerrar en rojo */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition text-xl"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Escudo encima del título */}
        <img
          src={escudo}
          alt="Escudo del Colegio"
          className="mx-auto mb-4 h-16 w-auto"
        />

        {/* Título */}
        <h2 className="text-lg font-semibold mb-5 text-center text-gray-800">
          Selecciona el motivo para agregar el activo
        </h2>

        {/* Botones más pequeños */}
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-md font-medium shadow"
            onClick={onSelectLey}
          >
            Por Ley
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-md font-medium shadow"
            onClick={onSelectDonacion}
          >
            Por Donación
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
