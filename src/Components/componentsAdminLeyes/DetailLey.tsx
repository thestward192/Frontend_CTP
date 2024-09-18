import React from 'react';
import { Ley } from '../../types/ley';

interface DetailLeyProps {
  ley: Ley | null;
  onClose: () => void;
  onEdit: () => void; // Añadimos la función para editar
}

const DetailLey: React.FC<DetailLeyProps> = ({ ley, onClose, onEdit }) => {
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

        <div className="flex justify-end space-x-4 mt-6">
          {/* Botón de cerrar */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={onClose}
          >
            Cerrar
          </button>

          {/* Botón de editar */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={onEdit} // Acción de editar
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailLey;
