import React, { useState, useEffect } from 'react';
import { Inventario } from '../../types/inventario';
import { updateActivo } from '../../Services/activoService';
import { useQueryClient } from 'react-query';
import { FaTimes } from 'react-icons/fa';

interface AdminInventarioModalProps {
  inventario: Inventario;
  onClose: () => void;
  onReviewComplete: (inventarioId: number) => void;
}

const AdminInventarioModal: React.FC<AdminInventarioModalProps> = ({ inventario, onClose, onReviewComplete }) => {
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);
  // Estado para cada detalle: true si se acepta el cambio, false en caso contrario.
  const [aceptaciones, setAceptaciones] = useState<boolean[]>([]);

  useEffect(() => {
    // Inicializamos todos los detalles como aceptados (por defecto true)
    setAceptaciones(inventario.detalles.map(() => true));
  }, [inventario.detalles]);

  const handleCheckboxChange = (index: number) => {
    setAceptaciones((prev) => {
      const newValues = [...prev];
      newValues[index] = !newValues[index];
      return newValues;
    });
  };

  const handleAccept = async () => {
    setProcessing(true);
    try {
      // Para cada detalle, si se aceptó, actualizamos el activo.
      for (let i = 0; i < inventario.detalles.length; i++) {
        if (aceptaciones[i]) {
          const detalle = inventario.detalles[i];
          await updateActivo(detalle.activo.id, { estado: detalle.estadoProvisional });
        }
      }
      console.log("Activos actualizados correctamente");
      // Invalida las queries para refrescar la data
      queryClient.invalidateQueries('activos');
      queryClient.invalidateQueries('inventarios');
      // Llamamos al callback para marcar este inventario como revisado
      onReviewComplete(inventario.id);
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
          <p className="text-lg font-semibold">
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
                <th className="px-4 py-2 text-gray-600 font-semibold">Aceptar Cambio</th>
              </tr>
            </thead>
            <tbody>
              {inventario.detalles.map((detalle, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{detalle.activo?.nombre}</td>
                  <td className="px-4 py-2 text-sm">{detalle.activo?.numPlaca}</td>
                  <td className="px-4 py-2 text-sm">{detalle.estadoProvisional}</td>
                  <td className="px-4 py-2 text-sm">{detalle.detalle}</td>
                  <td className="px-4 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={aceptaciones[index] || false}
                      onChange={() => handleCheckboxChange(index)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Botones: Aceptar (azul, izquierda) y Cancelar (gris, derecha) */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={processing}
          >
            {processing ? 'Procesando...' : 'Aceptar'}
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
  );
};

export default AdminInventarioModal;
