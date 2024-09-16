import React from 'react';
import { Licitacion } from '../../types/licitacion';

interface DetailLicitacionProps {
  licitacion: Licitacion | null;
  onClose: () => void;
  onEdit: () => void;
}

const DetailLicitacion: React.FC<DetailLicitacionProps> = ({ licitacion, onClose, onEdit }) => {
  if (!licitacion) return null;

  return (
    <>
      {/* Fondo oscuro detrás del modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Detalles de la Licitación</h2>
          <p className="mb-2"><strong>Fecha:</strong> {new Date(licitacion.fecha).toLocaleDateString()}</p>
          <p className="mb-2"><strong>Nº Acta:</strong> {licitacion.numActa}</p>
          <p className="mb-2"><strong>Nº Licitación:</strong> {licitacion.numLicitacion}</p>
          <p className="mb-2"><strong>Nombre de la Licitación:</strong> {licitacion.nombre}</p>
          <p className="mb-2"><strong>Monto:</strong> ${licitacion.monto}</p>
          <p className="mb-4"><strong>Descripción:</strong> {licitacion.descripcion}</p>
          <p className="mb-2"><strong>Proveedor:</strong> {licitacion.proveedor?.nombreProveedor}</p>
          <p className="mb-4"><strong>Ley:</strong> {licitacion.ley?.nombre}</p>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button onClick={onEdit} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Editar
            </button>
            <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailLicitacion;
