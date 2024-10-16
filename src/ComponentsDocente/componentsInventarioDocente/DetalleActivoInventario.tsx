import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useActivos } from '../../hooks/useActivo';


interface DetalleActivoInventarioProps {
  activo: any;
  onClose: () => void;
}

const DetalleActivoInventario: React.FC<DetalleActivoInventarioProps> = ({ activo, onClose }) => {
  const [estado, setEstado] = useState<string>(activo.estado);
  const [detalles, setDetalles] = useState<string>('');
  const { handleUpdateActivo } = useActivos();

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstado(e.target.value);
  };

  const handleDetallesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetalles(e.target.value);
  };

  const handleSave = () => {
    // Lógica para guardar el cambio de estado
    handleUpdateActivo({
      id: activo.id,
      data: { estado }
    });
    onClose(); // Cerrar el modal después de guardar
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalle del Activo</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            value={estado}
            onChange={handleEstadoChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleActivoInventario;
