import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { usePrestamo } from '../../hooks/usePrestamo';
import { Prestamo } from '../../types/prestamo';

interface ReportesPrestamosComponentProps {
  searchTerm: string;
}

const ReportesPrestamosComponent: React.FC<ReportesPrestamosComponentProps> = ({ searchTerm }) => {
  const { prestamos, loading, error } = usePrestamo();
  
  // Estados de filtrado
  const [filterNombre, setFilterNombre] = useState('');
  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterUbicacion, setFilterUbicacion] = useState('');
  
  // Estado para los préstamos filtrados
  const [filteredPrestamos, setFilteredPrestamos] = useState(prestamos);

  // Estados de paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(33);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageInput, setPageInput] = useState('');  // Actualiza los préstamos filtrados cuando se cambia algún filtro o los préstamos originales
  useEffect(() => {
    let prestamosFiltrados = prestamos || [];
    
    // Filtrar por término de búsqueda (activo)
    if (searchTerm) {
      prestamosFiltrados = prestamosFiltrados.filter((prestamo: Prestamo) =>
        prestamo.activo?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por nombre (prestado por o prestado a)
    if (filterNombre) {
      prestamosFiltrados = prestamosFiltrados.filter((prestamo: Prestamo) =>
        prestamo.prestadoPor?.nombre?.toLowerCase().includes(filterNombre.toLowerCase()) ||
        prestamo.prestadoA?.nombre?.toLowerCase().includes(filterNombre.toLowerCase())
      );
    }
    
    // Filtrar por número de placa del activo
    if (filterPlaca) {
      prestamosFiltrados = prestamosFiltrados.filter((prestamo: Prestamo) =>
        prestamo.activo?.numPlaca?.toLowerCase().includes(filterPlaca.toLowerCase())
      );
    }

    // Filtrar por ubicación (ubicación actual o nueva)
    if (filterUbicacion) {
      prestamosFiltrados = prestamosFiltrados.filter((prestamo: Prestamo) =>
        prestamo.ubicacion?.nombre?.toLowerCase().includes(filterUbicacion.toLowerCase()) ||
        prestamo.ubicacionActual?.nombre?.toLowerCase().includes(filterUbicacion.toLowerCase())
      );
    }
      setFilteredPrestamos(prestamosFiltrados);
    setCurrentPage(1);
  }, [filterNombre, filterPlaca, filterUbicacion, prestamos, searchTerm]);

  // Ordena los préstamos filtrados según el campo "id"
  const sortedFilteredPrestamos = useMemo(() => {
    return [...filteredPrestamos].sort((a, b) =>
      sortOrder === 'asc' ? a.id - b.id : b.id - a.id
    );
  }, [filteredPrestamos, sortOrder]);

  // Calcula el total de páginas según la cantidad de préstamos filtrados
  const totalPages = Math.ceil(sortedFilteredPrestamos.length / itemsPerPage);

  // Obtiene la porción de préstamos a mostrar en la página actual
  const paginatedPrestamos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedFilteredPrestamos.slice(start, start + itemsPerPage);
  }, [sortedFilteredPrestamos, currentPage, itemsPerPage]);

  // Función para generar números de página (mostrar siempre 5 números consecutivos)
  const getPageNumbers = () => {
    let pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
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

  return (
    <div className="w-full flex justify-center py-10">
      <div 
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative flex flex-col" 
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Reporte de Préstamos</h2>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              className="border px-3 py-2 rounded-md"
              value={filterNombre}
              onChange={(e) => setFilterNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por número de placa"
              className="border px-3 py-2 rounded-md"
              value={filterPlaca}
              onChange={(e) => setFilterPlaca(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por ubicación"
              className="border px-3 py-2 rounded-md"
              value={filterUbicacion}
              onChange={(e) => setFilterUbicacion(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-red-500">Error al cargar préstamos: {error}</p>}
        {loading ? (
          <p>Cargando préstamos...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Activo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Número de Placa</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Prestado Por</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Prestado A</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación Actual</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación Nueva</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha Préstamo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha Devolución</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPrestamos.map((prestamo) => (
                  <tr key={prestamo.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{prestamo.activo.nombre}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.activo.numPlaca || 'Sin placa'}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.prestadoPor.nombre}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.prestadoA.nombre}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.ubicacionActual.nombre}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.ubicacion.nombre}</td>
                    <td className="px-4 py-2 text-sm">{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm">
                      {prestamo.fechaDevolucion
                        ? new Date(prestamo.fechaDevolucion).toLocaleDateString()
                        : 'No devuelto'}
                    </td>
                    <td className="px-4 py-2 text-sm">{prestamo.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Controles de paginación y ordenamiento */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-8">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            {/* Selector de cantidad de entradas */}
            <div>
              <label className="text-sm text-gray-600 mr-2">Mostrar</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 border rounded"
              >
                <option value={10}>10</option>
                <option value={33}>33</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600 ml-2">entradas</span>
            </div>
            {/* Botón para cambiar el orden */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border rounded text-sm"
            >
               Orden: {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 bg-gray-200 rounded-md"
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded-md"
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            {getPageNumbers().map((page, index) => (
              <button 
                key={index}
                onClick={() => setCurrentPage(page as number)}
                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
    </div>
  );
};

export default ReportesPrestamosComponent;
