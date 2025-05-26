// src/components/ModalCrearInventario.tsx
import React, { useState, useEffect } from 'react';
import { Activo } from '../../types/activo';
import { InventarioDetalle } from '../../types/inventario';
import { useActivos } from '../../hooks/useActivo';
import { useAuth } from '../../hooks/AuthContext';
import DetalleActivoInventario from './DetalleActivoInventario';

interface ModalCrearInventarioProps {
  onClose: () => void;
  onSubmit: (data: { ubicacionId: number; detalles: InventarioDetalle[] }) => void;
}

const ModalCrearInventario: React.FC<ModalCrearInventarioProps> = ({ onClose, onSubmit }) => {
  const { ubicaciones } = useAuth();
  const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
  const [selectedActivo, setSelectedActivo] = useState<Activo | null>(null);
  const [inventarioDetalles, setInventarioDetalles] = useState<InventarioDetalle[]>([]);
  const { useActivosByUbicacion } = useActivos();
  const { data: activos = [], isLoading } = useActivosByUbicacion(selectedUbicacion || 0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (ubicaciones.length > 0 && !selectedUbicacion) {
      setSelectedUbicacion(ubicaciones[0].id);
    }
  }, [ubicaciones]);
  const itemsPerPage = 33;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivos = activos.slice(startIndex, startIndex + itemsPerPage);

  const handleUbicacionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUbicacion(parseInt(e.target.value, 10));
    setInventarioDetalles([]); // reinicia detalles al cambiar ubicación
  };

  const handleRowClick = (activo: Activo) => {
    setSelectedActivo(activo);
  };

  // Función que se usará desde el modal de detalle del activo
  const handleSaveDetalle = (detalle: InventarioDetalle) => {
    setInventarioDetalles((prev) => {
      const index = prev.findIndex((d) => d.activoId === detalle.activoId);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = detalle;
        return updated;
      }
      return [...prev, detalle];
    });
    setSelectedActivo(null);
  };

  const handleSubmit = () => {
    if (selectedUbicacion && inventarioDetalles.length > 0) {
      onSubmit({ ubicacionId: selectedUbicacion, detalles: inventarioDetalles });
      onClose();
    } else {
      alert('Debe seleccionar una ubicación y asignar detalles para al menos un activo.');
    }
  };

  return (    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crear Inventario</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6 flex items-center bg-gray-50 p-4 rounded-lg">
          <label className="text-gray-700 font-medium mr-4">Ubicación:</label>
          <select
            className="py-2 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={selectedUbicacion || ''}
            onChange={handleUbicacionSelect}
          >
            <option value="" disabled>Seleccione</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 300px)' }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Cargando activos...</div>
            </div>
          ) : (
            <table className="min-w-full table-auto border-collapse bg-white"><thead className="sticky top-0 bg-white shadow-sm">
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-gray-600">Imagen</th>
                  <th className="px-4 py-3 text-left text-gray-600">No. Identificador</th>
                  <th className="px-4 py-3 text-left text-gray-600">Nombre</th>
                  <th className="px-4 py-3 text-left text-gray-600">Marca</th>
                  <th className="px-4 py-3 text-left text-gray-600">Serie</th>
                  <th className="px-4 py-3 text-left text-gray-600">Estado Inventario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedActivos.map((activo) => {
                  const detalle = inventarioDetalles.find(d => d.activoId === activo.id);
                  return (
                    <tr
                      key={activo.id}
                      className="border-b hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(activo)}
                    >
                      <td className="px-4 py-3">
                        {activo.foto ? (
                          <img
                            src={activo.foto}
                            alt={activo.nombre}
                            className="w-12 h-12 object-cover rounded-md border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                            Sin imagen
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">{activo.numPlaca}</td>
                      <td className="px-4 py-3">{activo.nombre}</td>
                      <td className="px-4 py-3">{activo.marca}</td>
                      <td className="px-4 py-3">{activo.serie}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          detalle ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {detalle ? detalle.estadoProvisional : 'No asignado'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm">Total de Activos: {activos.length}</p>
          </div>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: Math.ceil(activos.length / itemsPerPage) }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(activos.length / itemsPerPage)}
            >
              &gt;
            </button>
          </div>
        </div>        <div className="mt-6 flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar Inventario
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
        {selectedActivo && (
          // Se reutiliza el componente de detalle para el activo en inventario
          <DetalleActivoInventario
            activo={selectedActivo}
            onClose={() => setSelectedActivo(null)}
            onSave={handleSaveDetalle}
          />
        )}
      </div>
    </div>
  );
};

export default ModalCrearInventario;
