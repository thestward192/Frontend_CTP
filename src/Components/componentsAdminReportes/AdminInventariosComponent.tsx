import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
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

  // Estados de paginación y orden
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 33; // Siempre 33 entradas
  const [pageInput, setPageInput] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 'asc': primero al último

  // Filtrar inventarios según fecha, ubicación y docente
  useEffect(() => {
    let filtrados = inventarios || [];
    if (filterFecha) {
      filtrados = filtrados.filter((inv) => inv.fecha.includes(filterFecha));
    }
    if (filterUbicacion) {
      filtrados = filtrados.filter((inv) =>
        inv.ubicacion?.nombre.toLowerCase().includes(filterUbicacion.toLowerCase())
      );
    }
    if (filterDocente) {
      filtrados = filtrados.filter((inv) =>
        inv.docente &&
        `${inv.docente.nombre} ${inv.docente.apellido_1}`.toLowerCase().includes(filterDocente.toLowerCase())
      );
    }
    setFilteredInventarios(filtrados);
    setCurrentPage(1);
  }, [filterFecha, filterUbicacion, filterDocente, inventarios]);

  // Ordenamos inventarios por id (puedes cambiar este criterio si lo necesitas)
  const sortedInventarios = useMemo(() => {
    return [...filteredInventarios].sort((a, b) =>
      sortOrder === 'asc' ? a.id - b.id : b.id - a.id
    );
  }, [filteredInventarios, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(sortedInventarios.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
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

  const handleRowClick = (inventario: any) => {
    setSelectedInventario(inventario);
    setIsModalOpen(true);
  };

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
        {/* Controles de paginación y orden */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4">
          {/* Izquierda: Mostrar 33 entradas y botón de orden */}
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
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
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded-md"
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            {getPageNumbers().map((page, index) =>
              page === '...' ? (
                <span key={index} className="px-3 py-1">...</span>
              ) : (
                <button 
                  key={index}
                  onClick={() => setCurrentPage(page as number)}
                  className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {page}
                </button>
              )
            )}
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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
                onChange={handlePageInput} 
                placeholder="Página" 
                className="border p-1 rounded w-16 text-sm"
              />
              <button 
                onClick={handlePageSearch}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Ir
              </button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && selectedInventario && (
        <AdminInventarioModal 
          inventario={selectedInventario}
          onClose={() => setIsModalOpen(false)}
          onReviewComplete={(id) => setFilteredInventarios(prev => 
            prev.map(inv => (inv.id === id ? { ...inv, revisado: true } : inv))
          )}
        />
      )}
    </div>
  );
};

export default AdminInventariosComponent;
