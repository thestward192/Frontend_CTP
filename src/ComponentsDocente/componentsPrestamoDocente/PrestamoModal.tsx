import React, { useState } from 'react';

interface PrestamoModalProps {
  prestamo: any;
  onClose: () => void;
  onUpdateEstado: (id: number, estado: string) => Promise<void>;
}

const PrestamoModal: React.FC<PrestamoModalProps> = ({ prestamo, onClose, onUpdateEstado }) => {
  const [estado, setEstado] = useState(prestamo.estado);

  const handleUpdateEstado = async () => {
    try {
      await onUpdateEstado(prestamo.id, estado);
      onClose();
    } catch (error) {
      console.error('Error actualizando el estado del préstamo:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Detalles del Préstamo</h2>
        <p><strong>Activo:</strong> {prestamo.activo?.nombre || 'Sin nombre'}</p>
        <p><strong>Prestado A:</strong> {prestamo.prestadoA?.nombre || 'Desconocido'}</p>
        <p><strong>Fecha de Préstamo:</strong> {new Date(prestamo.fechaPrestamo).toLocaleDateString()}</p>

        <label className="block mt-4 mb-2">Estado del Préstamo:</label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="En préstamo">En préstamo</option>
          <option value="Devuelto">Devuelto</option>
          <option value="No Devuelto">No Devuelto</option>
        </select>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleUpdateEstado}
          >
            Actualizar Estado
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrestamoModal;
