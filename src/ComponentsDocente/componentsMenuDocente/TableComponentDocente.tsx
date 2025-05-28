// src/componentsPagesDocente/TableComponentDocente.tsx

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useActivos } from '../../hooks/useActivo';
import { useAuth } from '../../hooks/AuthContext';
import DetalleActivoDocente from './DetalleActivoDocente';
import { Activo } from '../../types/activo';

interface TableComponentDocenteProps {
  searchTerm: string;                        // ← Nuevo prop
  onDetailToggle: (isDetailOpen: boolean) => void;
}

const TableComponentDocente: React.FC<TableComponentDocenteProps> = ({
  searchTerm,
  onDetailToggle,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(33);
  const { useActivosByUbicacion } = useActivos();
  const { ubicaciones } = useAuth();
  const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
  const [selectedActivo, setSelectedActivo] = useState<Activo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtros locales (estado, marca, nombre adicional)
  const [filterEstado, setFilterEstado] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterNombre, setFilterNombre] = useState(''); // opcional: búsqueda interna

  // Orden
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Input para salto de página
  const [pageInput, setPageInput] = useState('');

  // Obtenemos los activos según la ubicación seleccionada
  const { data: activos = [], isLoading: loading } =
    useActivosByUbicacion(selectedUbicacion || 0);

  // Selección por defecto de la primera ubicación
  useEffect(() => {
    if (
      ubicaciones &&
      ubicaciones.length > 0 &&
      selectedUbicacion === null
    ) {
      setSelectedUbicacion(ubicaciones[0].id);
    }
  }, [ubicaciones, selectedUbicacion]);

  // Seleccionar ubicación
  const handleUbicacionSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUbicacion(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  // Al hacer clic en una fila, abrimos modal y avisamos al padre
  const handleRowClick = (activo: Activo) => {
    setSelectedActivo(activo);
    setIsModalOpen(true);
    onDetailToggle(true);
  };

  // Filtrado combinado de: estado, marca, nombre local y searchBar
  const filteredActivos = useMemo(() => {
    const termBar = searchTerm.toLowerCase().trim();
    const termLocal = filterNombre.toLowerCase().trim();
    return activos.filter((activo) =>
      (filterEstado === '' || activo.estado === filterEstado) &&
      (filterMarca === '' ||
        activo.marca.toLowerCase().includes(filterMarca.toLowerCase())) &&
      (termLocal === '' ||
        activo.nombre.toLowerCase().includes(termLocal)) &&
      (termBar === '' ||
        activo.nombre.toLowerCase().includes(termBar))
    );
  }, [activos, filterEstado, filterMarca, filterNombre, searchTerm]);

  // Orden por `numPlaca`
  const sortedActivos = useMemo(() => {
    return [...filteredActivos].sort((a, b) => {
      const aP = a.numPlaca || '';
      const bP = b.numPlaca || '';
      return sortOrder === 'asc'
        ? aP.localeCompare(bP)
        : bP.localeCompare(aP);
    });
  }, [filteredActivos, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(sortedActivos.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedActivos.slice(start, start + itemsPerPage);
  }, [sortedActivos, currentPage, itemsPerPage]);

  // Generar números de página
  const getPageNumbers = () => {
    const pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    return pages;
  };

  const handlePageInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };
  const handlePageSearch = () => {
    const pageNum = parseInt(pageInput, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setPageInput('');
  };

  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* --- filtros superiores --- */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          {/* Ubicación */}
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-lg font-semibold text-black mr-4">
              Seleccione una ubicación:
            </span>
            <select
              className="bg-white w-[160px] h-[40px] p-2 rounded-lg border border-gray-300 shadow-sm text-sm"
              value={selectedUbicacion || ''}
              onChange={handleUbicacionSelect}
            >
              <option value="" disabled>
                -- Seleccione --
              </option>
              {ubicaciones.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Búsquedas locales */}
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

        {/* --- tabla --- */}
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div>Cargando activos...</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2">Imagen</th>
                  <th className="px-4 py-2">No. Identificador</th>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Marca</th>
                  <th className="px-4 py-2">Serie</th>
                  <th className="px-4 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(row)}
                  >
                    <td className="px-4 py-2">
                      {row.foto ? (
                        <img
                          src={row.foto}
                          alt={row.nombre}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                          Sin imagen
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{row.numPlaca}</td>
                    <td className="px-4 py-2">{row.nombre}</td>
                    <td className="px-4 py-2">{row.marca}</td>
                    <td className="px-4 py-2">{row.serie}</td>
                    <td className="px-4 py-2">
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
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No se encontraron activos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* --- paginación y controles --- */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-8">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <label className="text-sm text-gray-600 mr-2">Mostrar</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
              className="p-1 border rounded text-sm"
            >
              <option value={33}>33</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 ml-2">entradas</span>
            <button
              onClick={() =>
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }
              className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
            >
              Orden: {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              {'<<'}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              {'<'}
            </button>
            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === p ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              {'>'}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              {'>>'}
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

      {/* Modal de detalle */}
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
