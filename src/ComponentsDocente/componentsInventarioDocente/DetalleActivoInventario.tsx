// src/components/DetalleActivoInventario.tsx
import React, { useState } from 'react';
import { Activo } from '../../types/activo';
import { InventarioDetalle } from '../../types/inventario';

interface DetalleActivoInventarioProps {
  activo: Activo;
  onClose: () => void;
  onSave: (detalle: InventarioDetalle) => void;
}

const DetalleActivoInventario: React.FC<DetalleActivoInventarioProps> = ({ activo, onClose, onSave }) => {
  const [estadoProvisional, setEstadoProvisional] = useState('Bueno');
  const [detalle, setDetalle] = useState('');

  const handleSubmit = () => {
    // Se arma el objeto detalle con el id del activo y los datos ingresados
    const detalleObj: InventarioDetalle = {
      activoId: activo.id,
      estadoProvisional,
      detalle,
    };
    console.log('Detalle guardado para activo', activo.id, detalleObj);
    onSave(detalleObj);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Detalle para: {activo.nombre}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Estado Provisional</label>
          <select
            className="w-full border rounded p-2"
            value={estadoProvisional}
            onChange={(e) => setEstadoProvisional(e.target.value)}
          >
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Detalle</label>
          <textarea
            className="w-full border rounded p-2"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex justify-between space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Guardar
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleActivoInventario;
