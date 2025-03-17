import React, { useState, useEffect } from 'react';
import { useInventario } from '../../hooks/useInventario';
import AdminInventarioModal from './AdminInventarioModal';

const AdminInventariosComponent: React.FC = () => {
  const { inventarios, isLoading, error } = useInventario();
  const [filteredInventarios, setFilteredInventarios] = useState(inventarios);
  const [filterFecha, setFilterFecha] = useState('');
  const [filterUbicacion, setFilterUbicacion] = useState('');
  const [filterDocente, setFilterDocente] = useState('');
  const [selectedInventario, setSelectedInventario] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar inventarios según fecha, ubicación y docente
  useEffect(() => {
    let filtrados = inventarios;
    if (filterFecha) {
      filtrados = filtrados.filter((inv) => inv.fecha.includes(filterFecha));
    }
    if (filterUbicacion) {
      filtrados = filtrados.filter((inv) =>
        inv.ubicacion?.nombre.toLowerCase().includes(filterUbicacion.toLowerCase())
      );
    }
    if (filterDocente) {
      filtrados = filtrados.filter(
        (inv) =>
          inv.docente &&
          `${inv.docente.nombre} ${inv.docente.apellido_1}`.toLowerCase().includes(filterDocente.toLowerCase())
      );
    }
    setFilteredInventarios(filtrados);
  }, [filterFecha, filterUbicacion, filterDocente, inventarios]);

  const handleRowClick = (inventario: any) => {
    setSelectedInventario(inventario);
    setIsModalOpen(true);
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredInventarios.slice(startIndex, startIndex + itemsPerPage);

  // Callback para marcar el inventario como revisado
  const handleReviewComplete = (inventarioId: number) => {
    setFilteredInventarios((prev) =>
      prev.map((inv) =>
        inv.id === inventarioId ? { ...inv, revisado: true } : inv
      )
    );
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative flex flex-col"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Inventarios</h2>
          {/* Filtros */}
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Filtrar por fecha (YYYY-MM-DD)"
              className="border px-3 py-2 rounded-md"
              value={filterFecha}
              onChange={(e) => setFilterFecha(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por ubicación"
              className="border px-3 py-2 rounded-md"
              value={filterUbicacion}
              onChange={(e) => setFilterUbicacion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por docente"
              className="border px-3 py-2 rounded-md"
              value={filterDocente}
              onChange={(e) => setFilterDocente(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-red-500">Error al cargar inventarios: {error}</p>}
        {isLoading ? (
          <p>Cargando inventarios...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Docente</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Cantidad de Activos</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Revisión</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(inv)}
                  >
                    <td className="px-4 py-2 text-sm">{inv.fecha}</td>
                    <td className="px-4 py-2 text-sm">
                      {inv.docente ? `${inv.docente.nombre} ${inv.docente.apellido_1}` : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm">{inv.ubicacion?.nombre}</td>
                    <td className="px-4 py-2 text-sm">{inv.detalles.length}</td>
                    <td className="px-4 py-2 text-sm">
                      {inv.revisado ? (
                        <span className="text-green-600 font-semibold">Aceptado</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Sin revisar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">
              Total de Inventarios: {filteredInventarios.length}
            </p>
          </div>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: Math.ceil(filteredInventarios.length / itemsPerPage) }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredInventarios.length / itemsPerPage)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      {/* Modal para revisar y aceptar inventario */}
      {isModalOpen && selectedInventario && (
        <AdminInventarioModal
          inventario={selectedInventario}
          onClose={() => setIsModalOpen(false)}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
};

export default AdminInventariosComponent;
