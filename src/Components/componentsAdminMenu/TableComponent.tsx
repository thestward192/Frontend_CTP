import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
 // Usar el formulario de agregar activo
import DetalleComponent from './DetalleActivo';
import Filters from './Filters';
import SelectionModal from './SelectionModal';
import { useActivos } from '../../hooks/useActivo';
import { Activo } from '../../types/activo';
import FormularioAgregarActivo from './FormularioActivo';

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

  const { activos, loading, error } = useActivos();

  const itemsPerPage = 33;
  const totalPages = Math.ceil(activos.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = activos.slice(startIndex, startIndex + itemsPerPage);

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
                  <button className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition text-sm">Exportar</button>
                  <button className="bg-gray-500 text-white px-3 py-1 rounded-lg shadow hover:bg-gray-600 transition text-sm">Generar Sticker</button>
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

          <Filters />

          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {isSelectionMode && <th className="px-2 py-2 text-gray-600 font-semibold">Seleccionar</th>}
                  <th className="px-4 py-2 text-gray-600 font-semibold">No. Identificador</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Modelo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Adquisicion</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectAsset(row)}>
                    {isSelectionMode && (
                      <td className="px-2 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(row.id?.toString() || '')}
                          onChange={() => setSelectedItems([...selectedItems, row.id?.toString() || ''])}
                        />
                      </td>
                    )}
                    <td className="px-4 py-2 text-sm">{row.id}</td>
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
                  className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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
