// src/components/DetailUbicacion.tsx
import React from 'react';
import { Ubicacion } from '../../types/ubicacion';

interface DetailUbicacionProps {
  ubicacion: Ubicacion | null;
  onClose: () => void;
  onEdit: () => void; // Nueva prop para manejar la acción de editar
}

const DetailUbicacion: React.FC<DetailUbicacionProps> = ({ ubicacion, onClose, onEdit }) => {
  if (!ubicacion) {
    return null; // No mostrar nada si no hay ubicación seleccionada
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Detalles de Ubicación</h2>
        <p><strong>ID:</strong> {ubicacion.id}</p>
        <p><strong>Nombre:</strong> {ubicacion.nombre}</p>
        <p><strong>Pabellón:</strong> {ubicacion.pabellon}</p>
        <p><strong>Descripción:</strong> {ubicacion.descripcion}</p>
        <div className="mt-4 flex space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={onEdit} // Botón para editar la ubicación
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailUbicacion;
