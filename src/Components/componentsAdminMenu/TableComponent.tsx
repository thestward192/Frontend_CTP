import React, { useState, useMemo, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import DetalleComponent from './DetalleActivo';
import Filters from './Filters';
import SelectionModal from './SelectionModal';
import { useActivos } from '../../hooks/useActivo';
import { useExportToExcel } from '../../hooks/useExportToExcel';  // Hook para exportar
import { Activo } from '../../types/activo';
import FormularioAgregarActivo from './FormularioAgregarActivo';
import ConfiguracionExportacionModal from '../../Components/ComponentsAdminConfig/ConfiguracionExportacionModal';
import FilterDisponibilidad from '../componentsPages/FilterDisponibilidad';

interface TableComponentProps {
  onAssetSelect: (isSelected: boolean) => void;
  onAddAsset: (isAdding: boolean) => void;
  searchTerm: string;
}

const TableComponent: React.FC<TableComponentProps> = ({ onAssetSelect, onAddAsset, searchTerm }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoAdquisicion, setModoAdquisicion] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Activo | null>(null);
  const [isAddingActivo, setIsAddingActivo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Nueva lógica para ordenamiento
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtros
  const [filterNombre, setFilterNombre] = useState('');
  const [filterUbicacion, setFilterUbicacion] = useState('');
  const [filterModoAdquisicion, setFilterModoAdquisicion] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterNumPlaca, setFilterNumPlaca] = useState('');
  const [filterDisponibilidad, setFilterDisponibilidad] = useState<'Todos' | 'En Servicio' | 'Fuera de Servicio'>('Todos');

  const { activos, loading, error } = useActivos();
  const { exportToExcel } = useExportToExcel();

  useEffect(() => {
    setIsAllSelected(activos.length > 0 && selectedItems.length === activos.length);
  }, [activos, selectedItems]);

  const itemsPerPage = 33;

  // Aplicar filtros incluyendo el término de búsqueda
  const filteredData = useMemo(() => {
    return activos.filter((activo) => {
      const matchesNombre = activo.nombre.toLowerCase().includes((searchTerm || filterNombre).toLowerCase());
      const matchesUbicacion = activo.ubicacion?.nombre.toLowerCase().includes(filterUbicacion.toLowerCase());
      const matchesModoAdquisicion = !filterModoAdquisicion || activo.modoAdquisicion === filterModoAdquisicion;
      const matchesEstado = !filterEstado || activo.estado === filterEstado;
      const matchesNumPlaca = filterNumPlaca === '' || (activo.numPlaca && activo.numPlaca.toLowerCase().includes(filterNumPlaca.toLowerCase()));
      const matchesDisponibilidad = filterDisponibilidad === 'Todos' || activo.disponibilidad === filterDisponibilidad;
      return matchesNombre && matchesUbicacion && matchesModoAdquisicion && matchesEstado && matchesNumPlaca && matchesDisponibilidad;
    });
  }, [activos, searchTerm, filterNombre, filterUbicacion, filterModoAdquisicion, filterEstado, filterNumPlaca, filterDisponibilidad]);

  // Ordenar según sortOrder y numPlaca
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a.numPlaca || '';
      const bVal = b.numPlaca || '';
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal, undefined, { numeric: true })
        : bVal.localeCompare(aVal, undefined, { numeric: true });
    });
  }, [filteredData, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Paginación sobre datos ordenados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const getPageNumbers = () => {
    const pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
      pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageSearch = () => {
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    setPageInput('');
  };

  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case 'nombre':
        setFilterNombre(value);
        break;
      case 'ubicacion':
        setFilterUbicacion(value);
        break;
      case 'modoAdquisicion':
        setFilterModoAdquisicion(value);
        break;
      case 'estado':
        setFilterEstado(value);
        break;
      case 'numPlaca':
        setFilterNumPlaca(value);
        break;
    }
  };

  const enableSelectionMode = () => {
    setIsSelectionMode(true);
    setIsSelecting(true);
  };

  const handleCancel = () => {
    setIsSelectionMode(false);
    setIsSelecting(false);
    setSelectedItems([]);
  };  const handleSelectAsset = (asset: Activo) => {
    setSelectedAsset(asset);
    // Indica que se está mostrando el detalle, lo que cerrará el sidebar
    onAssetSelect(true);
  };

  const handleAddActivo = () => {
    onAddAsset(true);
    setIsModalOpen(true);
  };

  const handleSelectLey = () => {
    setIsModalOpen(false);
    setModoAdquisicion('Ley');
    setIsAddingActivo(true);
  };

  const handleSelectDonacion = () => {
    setIsModalOpen(false);
    setModoAdquisicion('Donación');
    setIsAddingActivo(true);
  };

  const handleCloseForm = () => {
    setIsAddingActivo(false);
    setModoAdquisicion(null);
    onAddAsset(false);
  };



  // Manejo de selección de activos
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(activos.map((activo) => activo.id?.toString() || ''));
    }
    setIsAllSelected(!isAllSelected);
  };

  const selectedActivos = activos.filter((activo) =>
    selectedItems.includes(activo.id?.toString() || '')
  );

  if (loading) {
    return <p>Cargando activos...</p>;
  }

  if (error) {
    return <p>Error al cargar los activos: {error}</p>;
  }

  const handleCloseSelection = () => {
    setIsModalOpen(false);
    onAddAsset(false);
  };

  return (
    <div className="w-full flex justify-center py-10 relative">
      {(!modoAdquisicion && !selectedAsset && !isAddingActivo) ? (
        <div
          className="w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
          style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="relative inline-block text-left">
              <h1 className="text-[22px] font-semibold text-black">Activos</h1>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
                onClick={handleAddActivo}
              >
                <FaPlus />
                <span>Agregar Activo</span>
              </button>
              {!isSelecting ? (
                <button
                  onClick={enableSelectionMode}
                  className="bg-blue-900 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-800 transition text-sm"
                >
                  Seleccionar
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsConfigModalOpen(true)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-700 transition text-sm"
                  >
                    Configurar exportación
                  </button>
                  <button
                    onClick={() => exportToExcel(selectedActivos)}
                    className={`${selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'} text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition text-sm`}
                    disabled={selectedItems.length === 0}
                  >
                    Exportar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:bg-red-700 transition text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 flex items-center space-x-4">
            <Filters onFilterChange={handleFilterChange} />
            <FilterDisponibilidad value={filterDisponibilidad} onChange={setFilterDisponibilidad} />
          </div>

          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {isSelectionMode && (
                    <th className="px-2 py-2 text-gray-600 font-semibold">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
                        <span>Seleccionar todo</span>
                      </div>
                    </th>
                  )}
                  <th className="px-4 py-2 text-gray-600 font-semibold">Imagen</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">No. Identificador</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Modelo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Modo Adquisición</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr
                    key={row.id ?? `row-${Math.random()}`}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => !isSelectionMode && row.id && handleSelectAsset(row)}
                  >
                    {isSelectionMode && (
                      <td className="px-2 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={row.id ? selectedItems.includes(row.id.toString()) : false}
                          onChange={() => row.id && toggleSelectItem(row.id.toString())}
                        />
                      </td>
                    )}
                    <td className="px-4 py-2 text-sm">
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
                    <td className="px-4 py-2 text-sm">{row.numPlaca || 'Sin Número de Placa'}</td>
                    <td className="px-4 py-2 text-sm">{row.nombre}</td>
                    <td className="px-4 py-2 text-sm">{row.modelo}</td>
                    <td className="px-4 py-2 text-sm">{row.ubicacion?.nombre || 'Ubicación desconocida'}</td>
                    <td className="px-4 py-2 text-sm">{row.modoAdquisicion}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md text-sm ${
                          row.estado === 'Bueno'
                            ? 'bg-green-100 text-green-800'
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
          </div>

          {/* Controles de paginación y orden */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">Total de Activos: {activos.length}</p>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1 border rounded text-sm"
              >
                Orden: {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded-md"
              >
                {"<<"}
              </button>
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded-md"
              >
                {"<"}
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 bg-gray-200 rounded-md"
              >
                {">"}
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 bg-gray-200 rounded-md"
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

          {isModalOpen && (
            <SelectionModal
              onSelectLey={handleSelectLey}
              onSelectDonacion={handleSelectDonacion}
              onClose={handleCloseSelection}   // ahora restablece el sidebar
            />
          )}
        </div>
      ) : modoAdquisicion ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <FormularioAgregarActivo onClose={handleCloseForm} modoAdquisicion={modoAdquisicion} />
        </div>      ) : null}      {selectedAsset && (
        <DetalleComponent
          asset={selectedAsset}
          onBack={() => {
            setSelectedAsset(null);
            // Indica que el detalle se cerró, lo que volverá a mostrar el sidebar
            onAssetSelect(false);
          }}
        />
      )}

      {isModalOpen && (
        <SelectionModal
          onSelectLey={handleSelectLey}
          onSelectDonacion={handleSelectDonacion}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isConfigModalOpen && (
        <ConfiguracionExportacionModal onClose={() => setIsConfigModalOpen(false)} />
      )}
    </div>
  );
};

export default TableComponent;
