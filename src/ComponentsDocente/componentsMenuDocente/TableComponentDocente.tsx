import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useActivos } from '../../hooks/useActivo';
import { useAuth } from '../../hooks/AuthContext';
import DetalleActivoDocente from './DetalleActivoDocente';
import { Activo } from '../../types/activo';

interface TableComponentDocenteProps {
  onDetailToggle: (isDetailOpen: boolean) => void;
}

const TableComponentDocente: React.FC<TableComponentDocenteProps> = ({ onDetailToggle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(33);
  const { useActivosByUbicacion } = useActivos();
  const { ubicaciones } = useAuth();
  const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
  const [selectedActivo, setSelectedActivo] = useState<Activo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtros
  const [filterEstado, setFilterEstado] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterNombre, setFilterNombre] = useState('');

  // Orden
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Input para salto de página
  const [pageInput, setPageInput] = useState('');

  // Obtenemos los activos según la ubicación seleccionada
  const { data: activos = [], isLoading: loading } = useActivosByUbicacion(selectedUbicacion || 0);

  // Selección por defecto de la primera ubicación
  useEffect(() => {
    if (ubicaciones && ubicaciones.length > 0 && selectedUbicacion === null) {
      setSelectedUbicacion(ubicaciones[0].id);
    }
  }, [ubicaciones, selectedUbicacion]);

  // Seleccionar ubicación
  const handleUbicacionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUbicacion(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  // Al hacer clic en una fila, se abre el modal y se notifica al padre
  const handleRowClick = (activo: Activo) => {
    setSelectedActivo(activo);
    setIsModalOpen(true);
    onDetailToggle(true);
  };

  // Filtrado de activos
  const filteredActivos = useMemo(() => {
    return activos.filter((activo) =>
      (filterEstado === '' || activo.estado === filterEstado) &&
      (filterMarca === '' || activo.marca.toLowerCase().includes(filterMarca.toLowerCase())) &&
      (filterNombre === '' || activo.nombre.toLowerCase().includes(filterNombre.toLowerCase()))
    );
  }, [activos, filterEstado, filterMarca, filterNombre]);

  // Orden por `numPlaca` (No. Identificador)
  const sortedActivos = useMemo(() => {
    return [...filteredActivos].sort((a, b) => {
      const placaA = a.numPlaca || '';
      const placaB = b.numPlaca || '';
      return sortOrder === 'asc'
        ? placaA.localeCompare(placaB)
        : placaB.localeCompare(placaA);
    });
  }, [filteredActivos, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(sortedActivos.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedActivos.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedActivos, currentPage, itemsPerPage]);

  // Función para generar números de página (si totalPages > 5 se muestran 5 números consecutivos)
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

  // Input para saltar a página
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
    <div className="w-full flex justify-center py-6">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Selector de ubicación y filtros en la parte superior */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-lg font-semibold text-black mr-4">Seleccione una ubicación:</span>
            <select
              className="bg-white w-[160px] h-[40px] p-2 rounded-lg border border-gray-300 shadow-sm text-sm"
              value={selectedUbicacion || ''}
              onChange={handleUbicacionSelect}
            >
              <option value="" disabled>
                -- Seleccione --
              </option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              className="py-2 px-4 rounded-lg shadow bg-gray-200 text-gray-800"
              placeholder="Filtrar por nombre"
              value={filterNombre}
              onChange={(e) => setFilterNombre(e.target.value)}
            />
            <input
              type="text"
              className="py-2 px-4 rounded-lg shadow bg-gray-200 text-gray-800"
              placeholder="Filtrar por marca"
              value={filterMarca}
              onChange={(e) => setFilterMarca(e.target.value)}
            />
            <select
              className="py-2 px-4 rounded-lg shadow bg-gray-200 text-gray-800"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todos los Estados</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Malo">Malo</option>
            </select>
          </div>
        </div>

        {/* Tabla de activos */}
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
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(row)}
                  >
                    <td className="px-4 py-2 text-sm">{row.numPlaca}</td>
                    <td className="px-4 py-2 text-sm">{row.nombre}</td>
                    <td className="px-4 py-2 text-sm">{row.marca}</td>
                    <td className="px-4 py-2 text-sm">{row.serie}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md text-sm ${
                          row.estado === 'Bueno'
                            ? 'bg-green-100 text-green-800'
                            : row.estado === 'Regular'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
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

        {/* Controles de paginación y orden (parte inferior) */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-8">
          {/* Izquierda: Mostrar entradas y botón de orden */}
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <div>
              <label className="text-sm text-gray-600 mr-2">Mostrar</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 border rounded text-sm"
              >
                <option value={33}>33</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600 ml-2">entradas</span>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
            >
              Orden: {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
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
                className={`px-3 py-1 rounded-md ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
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
              <button onClick={handlePageSearch} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                Ir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalle */}
      {isModalOpen && selectedActivo && (
        <DetalleActivoDocente
          activo={selectedActivo}
          onClose={() => {
            setIsModalOpen(false);
            onDetailToggle(false);
          }}
        />
      )}
    </div>
  );
};

export default TableComponentDocente;
