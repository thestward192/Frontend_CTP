import React, { useState, useEffect } from 'react';
import { useActivos } from '../../hooks/useActivo';
import { useAuth } from '../../hooks/AuthContext';
import DetalleActivoInventario from './DetalleActivoInventario';

const TableInventarioDocente: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { activos, loading, fetchActivosByUbicacion } = useActivos();
  const { ubicaciones } = useAuth();
  const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
  const [selectedActivo, setSelectedActivo] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (ubicaciones.length > 0 && selectedUbicacion === null) {
      const defaultUbicacionId = ubicaciones[0].id;
      setSelectedUbicacion(defaultUbicacionId);
      fetchActivosByUbicacion(defaultUbicacionId);
    }
  }, [ubicaciones]);

  useEffect(() => {
    if (selectedUbicacion !== null) {
      fetchActivosByUbicacion(selectedUbicacion);
    }
  }, [selectedUbicacion]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUbicacionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUbicacion(parseInt(event.target.value, 10));
  };

  const handleRowClick = (activo: any) => {
    setSelectedActivo(activo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivo(null);
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = activos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="text-[22px] font-semibold text-black mr-4">Seleccione una ubicación:</div>
            <select
              className="py-2 px-4 rounded-lg shadow bg-gray-200 text-gray-800"
              value={selectedUbicacion || ''}
              onChange={handleUbicacionSelect}
            >
              <option value="" disabled>-- Seleccione --</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div>Cargando activos...</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">No. Identificador</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Marca</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Serie</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(row)}>
                    <td className="px-4 py-2 text-sm">{row.id}</td>
                    <td className="px-4 py-2 text-sm">{row.nombre}</td>
                    <td className="px-4 py-2 text-sm">{row.marca}</td>
                    <td className="px-4 py-2 text-sm">{row.serie}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md text-sm ${row.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {row.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">Total de Activos: {activos.length}</p>
          </div>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: Math.ceil(activos.length / itemsPerPage) }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(activos.length / itemsPerPage)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedActivo && (
        <DetalleActivoInventario
          activo={selectedActivo}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TableInventarioDocente;
