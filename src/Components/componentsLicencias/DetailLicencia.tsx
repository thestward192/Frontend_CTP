// src/components/DetailLicencia.tsx
import React from 'react';

interface Licencia {
  nombre: string;
  descripcion: string;
  codigoLicencia: string;
}

interface DetailLicenciaProps {
  licencia: Licencia | null;
  onClose: () => void;
  onEdit: () => void;
}

const DetailLicencia: React.FC<DetailLicenciaProps> = ({ licencia, onClose, onEdit }) => {
  if (!licencia) return null; // No mostrar nada si no hay licencia seleccionada

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Detalles de la Licencia</h2>
        <p><strong>Nombre:</strong> {licencia.nombre}</p>
        <p><strong>Descripción:</strong> {licencia.descripcion}</p>
        <p><strong>Código de Licencia:</strong> {licencia.codigoLicencia}</p>
        <div className="mt-4 flex space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={onEdit}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailLicencia;
