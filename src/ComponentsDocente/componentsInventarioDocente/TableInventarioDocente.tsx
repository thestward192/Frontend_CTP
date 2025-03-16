import React, { useState } from 'react';
import { useInventario } from '../../hooks/useInventario';
import { useAuth } from '../../hooks/AuthContext';
import ModalCrearInventario from './ModalCrearInventario';

const TableInventarioDocente: React.FC = () => {
  const { inventarios, isLoading, createInventarioMutate } = useInventario();
  const { usuarioId, ubicaciones } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Función que se ejecuta al enviar la información desde el modal para crear un nuevo inventario
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
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Encabezado con título y botón para crear inventario */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">Historial de Inventarios</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
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
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Cantidad de Activos</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-100 cursor-pointer">
                    <td className="px-4 py-2 text-sm">{inv.fecha}</td>
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
      {isModalOpen && (
        <ModalCrearInventario
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default TableInventarioDocente;
