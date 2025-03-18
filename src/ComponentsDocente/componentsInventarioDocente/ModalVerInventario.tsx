import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Inventario, InventarioDetalle } from '../../types/inventario';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ModalVerInventarioProps {
  inventario: Inventario;
  onClose: () => void;
  onUpdate: (id: number, data: {
    fecha: string;
    ubicacionId?: number;
    detalles: {
      activoId: number;
      estadoProvisional: string;
      detalle: string;
    }[];
  }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const ModalVerInventario: React.FC<ModalVerInventarioProps> = ({ inventario, onClose, onUpdate, onDelete }) => {
  const [detalles, setDetalles] = useState<InventarioDetalle[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    setDetalles(inventario.detalles);
  }, [inventario.detalles]);

  const handleEstadoChange = (index: number, value: string) => {
    const updated = [...detalles];
    updated[index] = { ...updated[index], estadoProvisional: value };
    setDetalles(updated);
  };

  const handleDetalleChange = (index: number, value: string) => {
    const updated = [...detalles];
    updated[index] = { ...updated[index], detalle: value };
    setDetalles(updated);
  };

  const handleUpdateInventory = async () => {
    setProcessing(true);
    try {
      const updatedData = {
        fecha: inventario.fecha,
        ubicacionId: inventario.ubicacion?.id,
        detalles: detalles.map((detalle) => ({
          activoId: detalle.activo?.id as number,
          estadoProvisional: detalle.estadoProvisional,
          detalle: detalle.detalle,
        })),
      };
      await onUpdate(inventario.id, updatedData);
      onClose();
    } catch (error) {
      console.error("Error al actualizar inventario:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Función que se ejecuta al confirmar la eliminación
  const handleConfirmDelete = async () => {
    setProcessing(true);
    try {
      await onDelete(inventario.id);
      setShowConfirmDelete(false);
      onClose();
    } catch (error) {
      console.error("Error al eliminar inventario:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detalle del Inventario</h2>
            <button onClick={onClose}>
              <FaTimes className="text-gray-600 hover:text-gray-800" />
            </button>
          </div>
          {/* Información General */}
          <div className="mb-4">
            <p className="text-lg">Fecha: {inventario.fecha}</p>
            <p className="text-lg">Ubicación: {inventario.ubicacion?.nombre}</p>
            <p className="text-lg">
              Realizado por: {inventario.docente ? `${inventario.docente.nombre} ${inventario.docente.apellido_1}` : 'N/A'}
            </p>
          </div>
          {/* Tabla de Detalles */}
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
                {detalles.map((detalle, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-sm">{detalle.activo?.nombre}</td>
                    <td className="px-4 py-2 text-sm">{detalle.activo?.numPlaca}</td>
                    <td className="px-4 py-2 text-sm">
                      <select
                        value={detalle.estadoProvisional}
                        onChange={(e) => handleEstadoChange(index, e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="Bueno">Bueno</option>
                        <option value="Regular">Regular</option>
                        <option value="Malo">Malo</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <textarea
                        value={detalle.detalle}
                        onChange={(e) => handleDetalleChange(index, e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                        rows={2}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Botones de acción */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleUpdateInventory}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={processing}
            >
              {processing ? 'Procesando...' : 'Actualizar Inventario'}
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={processing}
            >
              {processing ? 'Procesando...' : 'Borrar Inventario'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={processing}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      {showConfirmDelete && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </>
  );
};

export default ModalVerInventario;
