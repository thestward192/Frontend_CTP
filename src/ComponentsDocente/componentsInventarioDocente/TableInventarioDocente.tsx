import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useInventario } from '../../hooks/useInventario';
import { useAuth } from '../../hooks/AuthContext';
import ModalCrearInventario from './ModalCrearInventario';
import ModalVerInventario from './ModalVerInventario';

const TableInventarioDocente: React.FC = () => {
  const { 
    inventarios, 
    isLoading, 
    createInventarioMutate, 
    updateInventarioMutate, 
    deleteInventarioMutate 
  } = useInventario();
  const { usuarioId } = useAuth();
  
  // Filtrar inventarios del docente autenticado
  const filteredInventarios = useMemo(() => 
    inventarios.filter((inv) => inv.docente?.id === usuarioId),
    [inventarios, usuarioId]
  );

  // Estados de paginación y orden
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 33; // Siempre se muestran 33 entradas
  const [pageInput, setPageInput] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 'asc' = primero al último

  // Ordenamos por "id" (ajusta si necesitas otro criterio)
  const sortedInventarios = useMemo(() => {
    return [...filteredInventarios].sort((a, b) => 
      sortOrder === 'asc' ? a.id - b.id : b.id - a.id
    );
  }, [filteredInventarios, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(sortedInventarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = useMemo(() => {
    return sortedInventarios.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedInventarios, currentPage, itemsPerPage]);

  // Función para generar números de página con puntos suspensivos
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageSearch = () => {
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    setPageInput('');
  };

  // Función para crear un nuevo inventario
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

  // Estados y funciones para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState<any>(null);

  const handleRowClick = (inventario: any) => {
    setSelectedInventario(inventario);
    setIsViewModalOpen(true);
  };

  const handleUpdate = async (id: number, data: { fecha: string; ubicacionId?: number; detalles: any[] }) => {
    updateInventarioMutate({ id, data });
  };

  const handleDelete = async (id: number) => {
    deleteInventarioMutate(id);
  };

  return (
    <div className="w-full flex justify-center py-6">
      <div 
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative flex flex-col" 
        style={{ height: 'calc(100vh - 220px)' }}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Historial de Inventarios</h1>
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
                    <td className="px-4 py-2 text-sm">{inv.docente ? `${inv.docente.nombre} ${inv.docente.apellido_1}` : 'N/A'}</td>
                    <td className="px-4 py-2 text-sm">{inv.ubicacion?.nombre}</td>
                    <td className="px-4 py-2 text-sm">{inv.detalles.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Controles de paginación y orden */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4">
          {/* Izquierda: Mostrar 33 entradas y botón de orden */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Mostrar 33 entradas</span>
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
            >
              Orden: {sortOrder === 'asc' ? 'Primero al último' : 'Último al primero'}
            </button>
          </div>
          {/* Derecha: Controles de paginación */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 bg-gray-200 rounded-md"
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded-md"
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {index + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 rounded-md"
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-1 bg-gray-200 rounded-md"
              disabled={currentPage === totalPages}
            >
              {">>"}
            </button>
            <div className="flex items-center space-x-1">
              <input 
                type="number"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                placeholder="Página"
                className="border p-1 rounded w-16 text-sm"
              />
              <button 
                onClick={() => {
                  const pageNumber = parseInt(pageInput);
                  if (pageNumber >= 1 && pageNumber <= totalPages) {
                    setCurrentPage(pageNumber);
                  }
                  setPageInput('');
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Ir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear inventario */}
      {isCreateModalOpen && (
        <ModalCrearInventario 
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Modal para ver inventario */}
      {isViewModalOpen && selectedInventario && (
        <ModalVerInventario 
          inventario={selectedInventario}
          onClose={() => setIsViewModalOpen(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default TableInventarioDocente;
