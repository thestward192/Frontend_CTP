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

  const itemsPerPage = 5;
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Crear Inventario</h2>
          <button onClick={onClose} className="text-red-600 font-bold">X</button>
        </div>
        <div className="mb-4 flex items-center">
          <label className="mr-2">Ubicación:</label>
          <select
            className="py-2 px-4 rounded-lg border"
            value={selectedUbicacion || ''}
            onChange={handleUbicacionSelect}
          >
            <option value="" disabled>Seleccione</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
          {isLoading ? (
            <div>Cargando activos...</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2">No. Identificador</th>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Marca</th>
                  <th className="px-4 py-2">Serie</th>
                  <th className="px-4 py-2">Estado Inventario</th>
                </tr>
              </thead>
              <tbody>
                {paginatedActivos.map((activo) => {
                  const detalle = inventarioDetalles.find(d => d.activoId === activo.id);
                  return (
                    <tr
                      key={activo.id}
                      className="border-b hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRowClick(activo)}
                    >
                      <td className="px-4 py-2">{activo.numPlaca}</td>
                      <td className="px-4 py-2">{activo.nombre}</td>
                      <td className="px-4 py-2">{activo.marca}</td>
                      <td className="px-4 py-2">{activo.serie}</td>
                      <td className="px-4 py-2">{detalle ? detalle.estadoProvisional : 'No asignado'}</td>
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
        </div>
        <div className="mt-4">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Guardar Inventario
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
