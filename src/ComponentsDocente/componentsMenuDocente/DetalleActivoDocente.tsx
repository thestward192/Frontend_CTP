import React from 'react';
import { Activo } from '../../types/activo';

interface DetalleActivoDocenteProps {
  activo: Activo;
  onClose: () => void;
}

const DetalleActivoDocente: React.FC<DetalleActivoDocenteProps> = ({ activo, onClose }) => {
  const handlePrestar = () => {
    // Implementar la lógica para prestar el activo
    console.log('Prestando activo:', activo.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Detalle del Activo</h2>
        <p><strong>No. Identificador:</strong> {activo.id}</p>
        <p><strong>Nombre:</strong> {activo.nombre}</p>
        <p><strong>Marca:</strong> {activo.marca}</p>
        <p><strong>Serie:</strong> {activo.serie}</p>
        <p><strong>Estado:</strong> {activo.estado}</p>

        <div className="mt-6 flex justify-between">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handlePrestar}
          >
            Prestar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleActivoDocente;
