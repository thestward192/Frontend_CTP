import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { FaTrash, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import FormularioLey from './FormularioLey';
import { useLeyes } from '../../hooks/useLey';
import DetailLey from './DetailLey';
import EditLeyForm from './EditLey';
import { Ley } from '../../types/ley';
import FilterDisponibilidad from '../componentsPages/FilterDisponibilidad';

interface LeyesComponentProps {
  onAddLey: (isAdding: boolean) => void;
}

const LeyesComponent: React.FC<LeyesComponentProps> = ({ onAddLey }) => {
  // Estados modales y mensajes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Estados de paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageInput, setPageInput] = useState('');

  const [filtroDisp, setFiltroDisp] = useState<'Todos' | 'En Servicio' | 'Fuera de Servicio'>('Todos');

  const { leyes, loading, error, getLeyDetails, selectedLey, editLey, updateDisponibilidadLeyMutation } = useLeyes();

  const handleLeyCreated = () => {
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
  };

  const handleLeyEdited = () => {
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
  };

  const handleUpdateDisponibilidad = async (id: number) => {
    const ley = leyes.find((ley) => ley.id === id);
    if (ley && ley.disponibilidad === 'Fuera de Servicio') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }
    await updateDisponibilidadLeyMutation.mutate(id);
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
    setDeleteModalOpen(null);
  };

  const handleViewDetails = async (id: number) => {
    await getLeyDetails(id);
    setIsEditing(false);
    setDetailModalOpen(true);
  };

  const handleEditClick = async (id: number) => {
    await getLeyDetails(id);
    setIsEditing(true);
    setDetailModalOpen(true);
  };

  const handleEditSave = async (id: number, updatedData: Partial<Ley>) => {
    await editLey({ id, leyData: updatedData });
    handleLeyEdited();
    setIsEditing(false);
    setDetailModalOpen(false);
  };

  const closeDetails = () => {
    setIsEditing(false);
    setDetailModalOpen(false);
  };

  // Genera la lista filtrada + ordenada
  const sortedLeyes = useMemo(() => {
    return [...(leyes || [])]
      // 1) filtramos
      .filter(ley =>
        filtroDisp === 'Todos' || ley.disponibilidad === filtroDisp
      )
      // 2) ordenamos por id
      .sort((a, b) =>
        sortOrder === 'asc' ? a.id - b.id : b.id - a.id
      );
  }, [leyes, sortOrder, filtroDisp]);

  // Calculamos el total de páginas
  const totalPages = Math.ceil(sortedLeyes.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  // Leyes a mostrar en la página actual
  const currentLeyes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedLeyes.slice(start, start + itemsPerPage);
  }, [sortedLeyes, currentPage, itemsPerPage]);

  // Función para generar números de página (mostrar solo 5 páginas consecutivas)
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
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Leyes</h2>
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => {
              onAddLey(true);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <span>Agregar Ley</span>
          </button>
        </div>

        <FilterDisponibilidad value={filtroDisp} onChange={setFiltroDisp} />

        {error && <p className="text-red-500">Error al cargar leyes.</p>}
        {loading ? (
          <p>Cargando leyes...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nº Ley</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Detalle</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentLeyes.map((ley) => (
                  <tr key={ley.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{ley.numLey}</td>
                    <td className="px-4 py-2 text-sm">{ley.nombre}</td>
                    <td className="px-4 py-2 text-sm truncate max-w-xs">{ley.detalle}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleViewDetails(ley.id)}
                        >
                          <FaEye className="mr-1" />
                        </button>
                        <button
                          className="bg-blue-200 hover:bg-blue-300 text-blue-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleEditClick(ley.id)}
                        >
                          <FaEdit className="mr-1" />
                        </button>
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => setDeleteModalOpen(ley.id)}
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
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              {"<"}
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
              {">"}
            </button>
            <button onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 bg-gray-200 rounded-md">
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
        <FormularioLey 
          onClose={() => {
            setIsModalOpen(false);
            onAddLey(false);
          }} 
          onLeyCreated={(ley) => {
            handleLeyCreated();
            setIsModalOpen(false);
            onAddLey(false);
          }} 
        />
      )}

      {detailModalOpen && selectedLey && (
        isEditing ? (
          <EditLeyForm
            ley={selectedLey}
            onSave={handleEditSave}
            onCancel={closeDetails}
          />
        ) : (
          <DetailLey
            ley={selectedLey}
            onClose={closeDetails}
          />
        )
      )}

      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Actualizar Disponibilidad de Ley</h2>
            <p>¿Estás seguro de que deseas cambiar la disponibilidad de esta Ley?</p>
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
          Acción Completada Correctamente!
        </div>
      )}

      {showErrorMessage && (
        <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError">
          Esta ley ya está Fuera de Servicio
        </div>
      )}
    </div>
  );
};

export default LeyesComponent;
