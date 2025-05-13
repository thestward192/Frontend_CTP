import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { FaTrash, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import FormularioUbicacion from './FormularioUbicacion';
import DetailUbicacion from './DetailUbicacion';
import EditUbicacionForm from './EditUbicacion';
import { useUbicacion } from '../../hooks/useUbicacion';
import FilterDisponibilidad from '../componentsPages/FilterDisponibilidad';

interface UbicacionesComponentProps {
  onAddUbicacion: (isAdding: boolean) => void;
  searchTerm?: string;
}

const UbicacionesComponent: React.FC<UbicacionesComponentProps> = ({ onAddUbicacion, searchTerm = '' }) => {
  // Estados de modales y mensajes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const {
    ubicaciones,
    loading,
    error,
    editUbicacion,
    updateDisponibilidad,
    getUbicacionDetails,
    selectedUbicacion
  } = useUbicacion();

  // Estados de paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(33);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageInput, setPageInput] = useState('');
  const [filtroDisp, setFiltroDisp] = useState<'Todos' | 'En Servicio' | 'Fuera de Servicio'>('Todos');

  const sortedUbicaciones = useMemo(() => {
    return [...(ubicaciones || [])]
      .filter(u => {
        const matchesDisp = filtroDisp === 'Todos' || u.disponibilidad === filtroDisp;
        const matchesSearch = !searchTerm || 
          u.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDisp && matchesSearch;
      })
      .sort((a, b) =>
        sortOrder === 'asc' ? a.id - b.id : b.id - a.id
      );
  }, [ubicaciones, sortOrder, filtroDisp, searchTerm]);

  const totalPages = Math.ceil(sortedUbicaciones.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  const currentUbicaciones = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedUbicaciones.slice(start, start + itemsPerPage);
  }, [sortedUbicaciones, currentPage, itemsPerPage]);

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

  const handleUbicacionCreated = () => {
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
  };

  const handleUpdateDisponibilidad = async (id: number) => {
    const ubicacionToUpdate = ubicaciones?.find((ubicacion) => ubicacion.id === id);
    if (ubicacionToUpdate?.disponibilidad === 'Fuera de Servicio') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }
    await updateDisponibilidad(id);
    setDeleteModalOpen(null);
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
  };

  const handleViewDetails = async (id: number) => {
    await getUbicacionDetails(id);
    setIsEditing(false);
    setDetailModalOpen(id);
  };

  const handleEditClick = async (id: number) => {
    await getUbicacionDetails(id);
    setIsEditing(true);
    setDetailModalOpen(id);
  };

  const handleEditSave = async (id: number, updatedData: Partial<any>) => {
    try {
      await editUbicacion(id, updatedData);
      setShowCompletedMessage(true);
      setTimeout(() => setShowCompletedMessage(false), 3000);
    } catch (error) {
      console.error('Error al editar la ubicación:', error);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    } finally {
      setIsEditing(false);
      setDetailModalOpen(null);
    }
  };

  const closeDetails = () => {
    setIsEditing(false);
    setDetailModalOpen(null);
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Ubicaciones</h2>
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => {
              onAddUbicacion(true);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <span>Agregar Ubicación</span>
          </button>
        </div>

        <FilterDisponibilidad value={filtroDisp} onChange={setFiltroDisp} />

        {error && <p className="text-red-500">Error al cargar ubicaciones</p>}

        {loading ? (
          <p>Cargando ubicaciones...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Pabellón</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Descripción</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUbicaciones.map((ubicacion) => (
                  <tr key={ubicacion.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{ubicacion.nombre}</td>
                    <td className="px-4 py-2 text-sm">{ubicacion.pabellon}</td>
                    <td className="px-4 py-2 text-sm truncate max-w-xs">{ubicacion.descripcion}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleViewDetails(ubicacion.id)}
                        >
                          <FaEye className="mr-1" />
                        </button>
                        <button
                          className="bg-blue-200 hover:bg-blue-300 text-blue-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleEditClick(ubicacion.id)}
                        >
                          <FaEdit className="mr-1" />
                        </button>
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => setDeleteModalOpen(ubicacion.id)}
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
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
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

      {isModalOpen && (
        <FormularioUbicacion
          onClose={() => {
            setIsModalOpen(false);
            onAddUbicacion(false);
          }}
          onUbicacionCreated={() => {
            handleUbicacionCreated();
            setIsModalOpen(false);
            onAddUbicacion(false);
          }}
        />
      )}

      {detailModalOpen && selectedUbicacion && (
        isEditing ? (
          <EditUbicacionForm
            ubicacion={selectedUbicacion}
            onSave={handleEditSave}
            onCancel={closeDetails}
          />
        ) : (
          <DetailUbicacion
            ubicacion={selectedUbicacion}
            onClose={closeDetails}
          />
        )
      )}

      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Actualizar Disponibilidad de Ubicación</h2>
            <p>¿Estás seguro de que deseas cambiar la disponibilidad de esta ubicación?</p>
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
          ¡Acción Completada Correctamente!
        </div>
      )}
      {showErrorMessage && (
        <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError">
          Esta ubicación ya está Fuera de Servicio
        </div>
      )}
    </div>
  );
};

export default UbicacionesComponent;
