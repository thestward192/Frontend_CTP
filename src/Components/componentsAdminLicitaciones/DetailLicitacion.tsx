import React from 'react';

interface DetailLicitacionProps {
  licitacion: {
    fecha: string;
    idLicitacion: string;
    numActa: string;
    numLicitacion: string;
    nombreLicitacion: string;
    montoAutorizado: string;
    descripcion: string;
  } | null;
  onClose: () => void;
  onEdit: () => void; // Función para manejar la edición
}

const DetailLicitacion: React.FC<DetailLicitacionProps> = ({ licitacion, onClose, onEdit }) => {
  if (!licitacion) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Detalles de la Licitación</h2>
        <p><strong>Fecha:</strong> {licitacion.fecha}</p>
        <p><strong>ID Licitación:</strong> {licitacion.idLicitacion}</p>
        <p><strong>Nº Acta:</strong> {licitacion.numActa}</p>
        <p><strong>Nº Licitación:</strong> {licitacion.numLicitacion}</p>
        <p><strong>Nombre de la Licitación:</strong> {licitacion.nombreLicitacion}</p>
        <p><strong>Monto Autorizado:</strong> {licitacion.montoAutorizado}</p>
        <p><strong>Descripción:</strong> {licitacion.descripcion}</p>

        <div className="flex justify-end space-x-4 mt-6">
          {/* Botón de editar */}
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            onClick={onEdit} // Función de edición
          >
            Editar
          </button>

          {/* Botón de cerrar */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={onClose} // Cierra el modal
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailLicitacion;
