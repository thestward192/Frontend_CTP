import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import DetalleComponent from './DetalleActivo';
import Filters from './Filters';
import SelectionModal from './SelectionModal';
import { useActivos } from '../../hooks/useActivo';
import { useExportToExcel } from '../../hooks/useExportToExcel';  // Importamos el hook para exportar
import { Activo } from '../../types/activo';
import FormularioAgregarActivo from './FormularioAgregarActivo';

interface TableComponentProps {
  onAssetSelect: (isSelected: boolean) => void;
  onAddAsset: (isAdding: boolean) => void;
}

  const TableComponent: React.FC<TableComponentProps> = ({ onAssetSelect, onAddAsset }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Controla el modal de selección
  const [modoAdquisicion, setModoAdquisicion] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Activo | null>(null);
  const [isAddingActivo, setIsAddingActivo] = useState(false); // Controla la apertura del formulario
  const [currentPage, setCurrentPage] = useState(1);
  const [isAllSelected, setIsAllSelected] = useState(false);


  const [filterNombre, setFilterNombre] = useState('');
  const [filterUbicacion, setFilterUbicacion] = useState('');
  const [filterModoAdquisicion, setFilterModoAdquisicion] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const { activos, loading, error } = useActivos();
  const { tomo, setTomo, exportToExcel } = useExportToExcel();  // Usamos el hook

  React.useEffect(() => {
    setIsAllSelected(activos.length > 0 && selectedItems.length === activos.length);
  }, [activos, selectedItems]);
  

  const itemsPerPage = 33;
  const totalPages = Math.ceil(activos.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    if (filterName === 'nombre') {
      setFilterNombre(value);
    } else if (filterName === 'ubicacion') {
      setFilterUbicacion(value);
    }else if (filterName === 'modoAdquisicion') {
      setFilterModoAdquisicion(value);
    } else if (filterName === 'estado') {
      setFilterEstado(value);
    }

  };

    const filteredData = activos.filter((activo) => {
    const matchesNombre = activo.nombre.toLowerCase().includes(filterNombre.toLowerCase());
    const matchesUbicacion = activo.ubicacion?.nombre.toLowerCase().includes(filterUbicacion.toLowerCase());
    const matchesModoAdquisicion = !filterModoAdquisicion || activo.modoAdquisicion === filterModoAdquisicion;
    const matchesEstado = !filterEstado || activo.estado === filterEstado;

    return matchesNombre && matchesUbicacion && matchesModoAdquisicion && matchesEstado;
  });
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const enableSelectionMode = () => {
    setIsSelectionMode(true);
    setIsSelecting(true);
  };

  const handleCancel = () => {
    setIsSelectionMode(false);
    setIsSelecting(false);
    setSelectedItems([]);
  };

  const handleSelectAsset = (asset: Activo) => {
    setSelectedAsset(asset);
    onAssetSelect(true); // Notifica que un activo ha sido seleccionado
  };

  const handleAddActivo = () => {
    setIsModalOpen(true);
  };

  const handleSelectLey = () => {
    setIsModalOpen(false);
    setModoAdquisicion('Ley');
    setIsAddingActivo(true);  // Abrimos el formulario de agregar activo
  };

  const handleSelectDonacion = () => {
    setIsModalOpen(false);
    setModoAdquisicion('Donación');
    setIsAddingActivo(true);  // Abrimos el formulario de agregar activo
  };

  const handleCloseForm = () => {
    setIsAddingActivo(false);  // Cerramos el formulario
    setModoAdquisicion(null);
    onAddAsset(false);
  };

  // Manejar selección de activos
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]); // Deselecciona todo
    } else {
      const allIds = activos.map((activo) => activo.id?.toString() || ''); // Selecciona todos los activos
      setSelectedItems(allIds);
    }
    setIsAllSelected(!isAllSelected); // Cambia el estado del checkbox "Seleccionar todo"
  };
  

  // Filtrar los activos seleccionados
  const selectedActivos = activos.filter((activo) => selectedItems.includes(activo.id?.toString() || ''));

  if (loading) {
    return <p>Cargando activos...</p>;
  }

  if (error) {
    return <p>Error al cargar los activos: {error}</p>;
  }

  return (
    <div className="w-full flex justify-center py-10 relative">
      {!modoAdquisicion && !selectedAsset && !isAddingActivo ? (
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
                  {/* Input para el número de tomo */}
                  <input
                    type="number"
                    placeholder="Numero de tomo"
                    value={tomo !== null ? tomo : ''}
                    onChange={(e) => setTomo(Number(e.target.value) || 1)} // Tomo predeterminado a 1
                    className="border p-2"
                  />
                  <button
                    onClick={() => {
                    exportToExcel(selectedActivos); // Exportar los activos seleccionados
                    setTomo(null); // Limpiar el valor del tomo después de exportar
                    }}
                    className={`${
                    selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'
                    } text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition text-sm`}
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

          <Filters onFilterChange={handleFilterChange} />

          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
            <thead>
             <tr className="bg-gray-50">
              {isSelectionMode && (
              <th className="px-2 py-2 text-gray-600 font-semibold">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              <span>Seleccionar todo</span>
              </div>
              </th>
              )}
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
                    key={row.id ? row.id : `row-${Math.random()}`} // Proveer una clave única si `id` no está definido
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => !isSelectionMode && row.id && handleSelectAsset(row)} // Evitar si `id` es undefined
                  >
                    {isSelectionMode && (
                      <td className="px-2 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={row.id ? selectedItems.includes(row.id.toString()) : false} // Verificamos si `id` es válido
                          onChange={() => row.id && toggleSelectItem(row.id.toString())} // Solo cambiar si `id` es válido
                        />
                      </td>
                    )}
                    <td className="px-4 py-2 text-sm">{row.id ?? 'Sin ID'}</td> {/* Mostrar 'Sin ID' si no hay ID */}
                    <td className="px-4 py-2 text-sm">{row.nombre}</td>
                    <td className="px-4 py-2 text-sm">{row.modelo}</td>
                    <td className="px-4 py-2 text-sm">{row.ubicacion?.nombre || 'Ubicación desconocida'}</td>
                    <td className="px-4 py-2 text-sm">{row.modoAdquisicion}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-3 py-1 rounded-md text-sm ${row.estado === 'Bueno' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {row.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              {Array.from({ length: totalPages }, (_, index) => (
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
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>

          {isModalOpen && (
            <SelectionModal
              onSelectLey={handleSelectLey}
              onSelectDonacion={handleSelectDonacion}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      ) : modoAdquisicion ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <FormularioAgregarActivo onClose={handleCloseForm} modoAdquisicion={modoAdquisicion} />
        </div>
      ) : selectedAsset ? (
        <DetalleComponent
          asset={selectedAsset}
          onBack={() => {
            setSelectedAsset(null);
            onAssetSelect(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default TableComponent;