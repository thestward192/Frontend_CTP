import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Inventario } from '../../types/inventario';

interface ModalVerInventarioProps {
  inventario: Inventario;
  onClose: () => void;
}

const ModalVerInventario: React.FC<ModalVerInventarioProps> = ({ inventario, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Detalle del Inventario</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-lg">Fecha: {inventario.fecha}</p>
          <p className="text-lg">Ubicación: {inventario.ubicacion?.nombre}</p>
          <p className="text-lg">
            Realizado por: {inventario.docente ? `${inventario.docente.nombre} ${inventario.docente.apellido_1}` : 'N/A'}
          </p>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Activo</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Número de Placa</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Estado Provisional</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {inventario.detalles.map((detalle, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{detalle.activo?.nombre}</td>
                  <td className="px-4 py-2 text-sm">{detalle.activo?.numPlaca}</td>
                  <td className="px-4 py-2 text-sm">{detalle.estadoProvisional}</td>
                  <td className="px-4 py-2 text-sm">{detalle.detalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerInventario;
