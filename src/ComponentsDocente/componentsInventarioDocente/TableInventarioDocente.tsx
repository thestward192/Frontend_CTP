import React, { useState } from 'react';
import { useInventario } from '../../hooks/useInventario';
import { useAuth } from '../../hooks/AuthContext';
import ModalCrearInventario from './ModalCrearInventario';
import ModalVerInventario from './ModalVerInventario';

const TableInventarioDocente: React.FC = () => {
  const { inventarios, isLoading, createInventarioMutate } = useInventario();
  const { usuarioId, ubicaciones } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Filtrar inventarios del docente autenticado
  const filteredInventarios = inventarios.filter(
    (inv) => inv.docente?.id === usuarioId
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredInventarios.slice(startIndex, startIndex + itemsPerPage);

  // Función para crear un nuevo inventario a partir de los datos ingresados en el modal
  const handleModalSubmit = (modalData: { ubicacionId: number; detalles: any[] }) => {
    if (!usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }
    const fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const nuevoInventario = {
      fecha,
      docenteId: usuarioId,
      ubicacionId: modalData.ubicacionId,
      detalles: modalData.detalles,
    };
    createInventarioMutate(nuevoInventario, {
      onSuccess: () => {
        console.log('Inventario creado con éxito');
      },
      onError: (error) => {
        console.error('Error creando inventario:', error);
      },
    });
    setIsCreateModalOpen(false);
  };

  // Al hacer clic en una fila se abre el modal para ver el detalle del inventario
  const handleRowClick = (inventario: any) => {
    setSelectedInventario(inventario);
    setIsViewModalOpen(true);
  };

  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Encabezado: Título y botón para crear inventario */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">Historial de Inventarios</h1>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Hacer Inventario
          </button>
        </div>

        {/* Tabla del historial */}
        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div>Cargando inventarios...</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Docente</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Cantidad de Activos</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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
              onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredInventarios.length / itemsPerPage)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal para crear un nuevo inventario */}
      {isCreateModalOpen && (
        <ModalCrearInventario
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Modal para ver los detalles del inventario seleccionado */}
      {isViewModalOpen && selectedInventario && (
        <ModalVerInventario
          inventario={selectedInventario}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TableInventarioDocente;
