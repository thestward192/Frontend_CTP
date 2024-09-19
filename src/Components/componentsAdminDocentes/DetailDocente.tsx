// src/components/DetailDocente.tsx
import React from 'react';

interface Docente {
  nombre: string;
  apellido: string;
  email: string;
  ubicacion: string;
  imagen: string;
}

interface DetailDocenteProps {
  docente: Docente | null;
  onClose: () => void;
  onEdit: () => void;
}

const DetailDocente: React.FC<DetailDocenteProps> = ({ docente, onClose, onEdit }) => {
  if (!docente) return null; // No mostrar nada si no hay docente seleccionado

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">Detalles del Docente</h2>
        <img src={docente.imagen} alt={`${docente.nombre} ${docente.apellido}`} className="w-24 h-24 rounded-full mb-4 object-cover" />
        <p><strong>Nombre:</strong> {docente.nombre}</p>
        <p><strong>Apellido:</strong> {docente.apellido}</p>
        <p><strong>Email:</strong> {docente.email}</p>
        <p><strong>Ubicación:</strong> {docente.ubicacion}</p>

        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onClick={onClose}>
            Cerrar
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={onEdit}>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailDocente;
