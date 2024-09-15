// src/components/DetailLey.tsx
import React from 'react';
import { Ley } from '../../types/ley';

interface DetailLeyProps {
  ley: Ley | null;
  onClose: () => void;
}

const DetailLey: React.FC<DetailLeyProps> = ({ ley, onClose }) => {
  if (!ley) {
    return null; // No mostrar nada si no hay ley seleccionada
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Detalles de la Ley</h2>
        <p><strong>ID:</strong> {ley.id}</p>
        <p><strong>Número de Ley:</strong> {ley.numLey}</p>
        <p><strong>Nombre:</strong> {ley.nombre}</p>
        <p><strong>Detalle:</strong> {ley.detalle}</p>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DetailLey;
