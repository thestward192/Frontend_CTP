import React, { useState, useEffect } from 'react';
import { useActivos } from '../../hooks/useActivo';

interface Ubicacion {
  id: number;
  nombre: string;
}

const TableComponentDocente: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { activos, loading, fetchActivosByUbicacion } = useActivos();
  const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

  useEffect(() => {
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token para obtener los datos del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUbicaciones(payload.ubicaciones || []); // Obtener las ubicaciones directamente del token
    }
  }, []);

  useEffect(() => {
    if (selectedUbicacion !== null) {
      fetchActivosByUbicacion(selectedUbicacion);
    }
  }, [selectedUbicacion]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUbicacionSelect = (ubicacionId: number) => {
    setSelectedUbicacion(ubicacionId);
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = activos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="relative inline-block text-left">
            <div className="text-[22px] font-semibold text-black">Seleccione una ubicación:</div>
            <div className="flex space-x-2 mt-2">
              {ubicaciones.map((ubicacion) => (
                <button
                  key={ubicacion.id}
                  onClick={() => handleUbicacionSelect(ubicacion.id)}
                  className={`py-2 px-4 rounded-lg shadow ${selectedUbicacion === ubicacion.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {ubicacion.nombre}
                </button>
              ))}
            </div>
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
                  <th className="px-4 py-2 text-gray-600 font-semibold">Marca</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Modelo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Serie</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{row.id}</td>
                    <td className="px-4 py-2 text-sm">{row.marca}</td>
                    <td className="px-4 py-2 text-sm">{row.modelo}</td>
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
    </div>
  );
};

export default TableComponentDocente;
