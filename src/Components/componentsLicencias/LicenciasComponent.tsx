import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { FaTrash, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import { useLicencias } from '../../hooks/useLicencia';
import FormularioLicencia from './FormularioLicencia';
import DetailLicencia from './DetailLicencia';
import EditLicencia from './EditLicencia';
import { CreateLicenciaDTO, Licencia } from '../../types/licencia';
import FilterDisponibilidad from '../componentsPages/FilterDisponibilidad';

interface LicenciasComponentProps {
  onAddLicencia: (isAdding: boolean) => void;
}

// Recorta la descripción si supera cierto largo
function getShortDescription(description: string, maxLength = 80) {
  if (!description) return '';
  return description.length <= maxLength
    ? description
    : description.slice(0, maxLength) + '...';
}

const LicenciasComponent: React.FC<LicenciasComponentProps> = ({ onAddLicencia }) => {
  const { licencias, loading, error, addLicencia, updateDisponibilidadLicenciaMutation } = useLicencias();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLicencia, setSelectedLicencia] = useState<Licencia | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Paginación y orden
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(33);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageInput, setPageInput] = useState('');

  // Filtros
  const [filtroDisp, setFiltroDisp] = useState<'Todos' | 'En Servicio' | 'Fuera de Servicio'>('Todos');
  const [searchIdentificador, setSearchIdentificador] = useState('');

  // Filtrar + ordenar antes de paginar
  const sortedLicencias = useMemo(() => {
    return [...(licencias || [])]
      .filter(lic =>
        (filtroDisp === 'Todos' || lic.disponibilidad === filtroDisp) &&
        lic.numeroIdentificador
          .toString()
          .toLowerCase()
          .includes(searchIdentificador.trim().toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === 'asc' ? a.id - b.id : b.id - a.id
      );
  }, [licencias, sortOrder, filtroDisp, searchIdentificador]);

  const totalPages = Math.ceil(sortedLicencias.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  const currentLicencias = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedLicencias.slice(start, start + itemsPerPage);
  }, [sortedLicencias, currentPage, itemsPerPage]);

  const getPageNumbers = () => {
    let pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
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

  const handleViewDetails = (licencia: Licencia) => {
    setSelectedLicencia(licencia);
  };

  const handleEditClick = (licencia: Licencia) => {
    setSelectedLicencia(licencia);
    setIsEditing(true);
  };

  const handleCloseDetail = () => {
    setIsEditing(false);
    setSelectedLicencia(null);
  };

  const handleUpdateDisponibilidad = async (id: number) => {
    const licencia = licencias?.find((lic) => lic.id === id);
    if (licencia && licencia.disponibilidad === 'Fuera de Servicio') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }
    try {
      await updateDisponibilidadLicenciaMutation.mutateAsync(id);
      setShowCompletedMessage(true);
      setTimeout(() => setShowCompletedMessage(false), 3000);
      setDeleteModalOpen(null);
    } catch {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  const handleAddLicenciaSubmit = async (licencia: CreateLicenciaDTO) => {
    try {
      await addLicencia(licencia);
      setIsModalOpen(false);
      onAddLicencia(false);
    } catch (error) {
      console.error("Error al agregar la licencia:", error);
    }
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Licencias</h2>
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => {
              onAddLicencia(true);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <span>Agregar Licencia</span>
          </button>
        </div>

       {/* filtro de disponibilidad a la izquierda y Nº Identificador a la derecha */}
<div className="flex justify-between items-center mb-6">
  <FilterDisponibilidad
    value={filtroDisp}
    onChange={setFiltroDisp}
  />
  <input
    type="text"
    value={searchIdentificador}
    onChange={e => setSearchIdentificador(e.target.value)}
    placeholder="Nº Identificador"
    className="h-8 w-40 px-3 text-sm border border-gray-200 rounded shadow focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
</div>

        {error && <p className="text-red-500">Error al cargar licencias.</p>}
        {loading ? (
          <p>Cargando licencias...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">No. Identificador</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Descripción</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Código de Licencia</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Modo Adquisición</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentLicencias.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{row.numeroIdentificador}</td>
                    <td className="px-4 py-2 text-sm">{row.nombre}</td>
                    <td className="px-4 py-2 text-sm">
                      {getShortDescription(row.descripcion, 80)}
                    </td>
                    <td className="px-4 py-2 text-sm">{row.codigoLicencia}</td>
                    <td className="px-4 py-2 text-sm">{row.modoAdquisicion}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-3">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleViewDetails(row)}
                        >
                          <FaEye className="mr-1" />
                        </button>
                        <button
                          className="bg-blue-200 hover:bg-blue-300 text-blue-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleEditClick(row)}
                        >
                          <FaEdit className="mr-1" />
                        </button>
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => setDeleteModalOpen(row.id)}
                        >
                          <FaTrash className="mr-1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Controles de paginación y filtros */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-8">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
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
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border rounded text-sm"
            >
              Orden: {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(1)} className="px-3 py-1 bg-gray-200 rounded-md">
              {'<<'}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              {'<'}
            </button>
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
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
            >
              {'>'}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
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

      {isModalOpen && (
        <FormularioLicencia
          onClose={() => {
            setIsModalOpen(false);
            onAddLicencia(false);
          }}
          onSave={handleAddLicenciaSubmit}
        />
      )}

      {selectedLicencia && (
        isEditing ? (
          <EditLicencia licencia={selectedLicencia} onClose={handleCloseDetail} />
        ) : (
          <DetailLicencia licencia={selectedLicencia} onClose={handleCloseDetail} />
        )
      )}

      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Actualizar Disponibilidad de Licencia</h2>
            <p>¿Estás seguro de que deseas marcar esta licencia como "Fuera de Servicio"?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => handleUpdateDisponibilidad(deleteModalOpen!)}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setDeleteModalOpen(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompletedMessage && (
        <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulse">
          Licencia marcada como Fuera de Servicio.
        </div>
      )}

      {showErrorMessage && (
        <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError">
          La Licencia ya está Fuera de Servicio
        </div>
      )}
    </div>
  );
};

export default LicenciasComponent;
