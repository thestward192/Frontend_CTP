import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { InventarioDetalle } from '../../types/inventario';

interface DetalleActivoInventarioProps {
  activo: any;
  onClose: () => void;
  onSave: (detalle: InventarioDetalle) => void;
}

const DetalleActivoInventario: React.FC<DetalleActivoInventarioProps> = ({ activo, onClose, onSave }) => {
  // Por defecto se asigna "Bueno" al estado provisional
  const [estadoProvisional, setEstadoProvisional] = useState<string>('Bueno');
  const [detalle, setDetalle] = useState<string>('');

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoProvisional(e.target.value);
  };

  const handleDetalleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetalle(e.target.value);
  };

  const handleSave = () => {
    // Se crea el objeto que representa el detalle del inventario para este activo
    const inventarioDetalle: InventarioDetalle = {
      activoId: activo.id,
      estadoProvisional,
      detalle,
    };
    onClose(); // Se cierra el modal después de guardar
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalle del Activo - {activo.nombre}</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado Provisional</label>
          <select
            value={estadoProvisional}
            onChange={handleEstadoChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Detalle</label>
          <textarea
            value={detalle}
            onChange={handleDetalleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleActivoInventario;
