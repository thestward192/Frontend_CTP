import React, { useState } from 'react';
import { Inventario } from '../../types/inventario';
import { updateActivo } from '../../Services/activoService'; // Asegúrate de tener este servicio implementado
import { useQueryClient } from 'react-query';
import { FaTimes } from 'react-icons/fa';

interface AdminInventarioModalProps {
  inventario: Inventario;
  onClose: () => void;
}

const AdminInventarioModal: React.FC<AdminInventarioModalProps> = ({ inventario, onClose }) => {
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  const handleAccept = async () => {
    setProcessing(true);
    try {
      // Recorrer cada detalle del inventario para actualizar el estado real del activo
      for (const detalle of inventario.detalles) {
        // Se asume que en la relación se trae el activo completo (detalle.activo)
        await updateActivo(detalle.activo.id, { estado: detalle.estadoProvisional });
      }
      console.log("Activos actualizados correctamente");
      // Invalida las queries si es necesario para refrescar la data
      queryClient.invalidateQueries('activos');
      queryClient.invalidateQueries('inventarios');
      onClose();
    } catch (error) {
      console.error("Error al actualizar activos:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Revisión de Inventario</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">Fecha: {inventario.fecha}</p>
          <p className="text-lg font-semibold">Ubicación: {inventario.ubicacion?.nombre}</p>
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
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={processing}
          >
            Cancelar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={processing}
          >
            {processing ? 'Procesando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminInventarioModal;
