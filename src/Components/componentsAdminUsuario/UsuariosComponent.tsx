import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { FaTrash, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import FormularioUsuario from './FormularioUsuario';
import FormularioEditarUsuario from './FormularioEditarUsuario';
import DetailUsuario from './DetailUsuario';
import { User } from '../../types/user';
import { useUsers } from '../../hooks/useUser';

const UsuariosComponent: React.FC = () => {
  // Estados de modales y mensajes
  const { users = [], loading, error, updateDisponibilidadMutation, editUserMutation } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<number | null>(null);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Estados de paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(33);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageInput, setPageInput] = useState('');

  // Ordenamos los usuarios según "id" (o la propiedad que prefieras) según sortOrder
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id);
  }, [users, sortOrder]);

  // Calculamos el total de páginas
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Aseguramos que la página actual no exceda el total
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  // Usuarios a mostrar en la página actual
  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [sortedUsers, currentPage, itemsPerPage]);

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

  // Manejadores para el input de salto de página
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

  // Handlers propios del componente
  const handleViewDetails = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleUpdateAvailability = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user && user.disponibilidad === 'Fuera de Servicio') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }
    await updateDisponibilidadMutation.mutateAsync(userId);
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
    setIsDeleteModalOpen(null);
  };

  const handleSaveEdit = async (userId: number, updatedData: Partial<User>) => {
    try {
      await editUserMutation.mutateAsync({ userId, updatedData });
      setIsEditModalOpen(null);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al editar el usuario:', error);
    }
  };

  const handleEditClick = (userId: number) => {
    setIsEditModalOpen(userId);
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Usuario</span>
          </button>
        </div>

        {loading ? (
          <div>Cargando usuarios...</div>
        ) : error ? (
          <div>
            Error al cargar los usuarios:{' '}
            {error instanceof Error ? error.message : 'Ocurrió un error desconocido'}
          </div>
        ) : !users.length ? (
          <div>No hay usuarios disponibles</div>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Primer Apellido</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Segundo Apellido</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Email</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{user.nombre}</td>
                    <td className="px-4 py-2 text-sm">{user.apellido_1}</td>
                    <td className="px-4 py-2 text-sm">{user.apellido_2}</td>
                    <td className="px-4 py-2 text-sm">{user.email}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleViewDetails(user.id)}
                        >
                          <FaEye className="mr-1" />
                        </button>
                        <button
                          className="bg-blue-200 hover:bg-blue-300 text-blue-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleEditClick(user.id)}
                        >
                          <FaEdit className="mr-1" />
                        </button>
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => setIsDeleteModalOpen(user.id)}
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

        {/* Filtros y controles de paginación reubicados */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-8">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            {/* Selector de cantidad de entradas por página */}
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
            <button onClick={() => setCurrentPage(1)} className="px-3 py-1 bg-gray-200 rounded-md">
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded-md"
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
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              )
            )}
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

      {/* Modal para agregar usuario */}
      {isModalOpen && <FormularioUsuario onClose={() => setIsModalOpen(false)} />}
      {/* Modal para ver detalles */}
      {selectedUser !== null && (
        <DetailUsuario
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {/* Modal para editar usuario */}
      {isEditModalOpen !== null && (
        <FormularioEditarUsuario
          userId={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(null);
            setSelectedUser(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal para confirmar cambio de disponibilidad */}
      {isDeleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Actualizar Disponibilidad de Usuario</h2>
            <p>¿Estás seguro de que deseas cambiar la disponibilidad de este Usuario?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => handleUpdateAvailability(isDeleteModalOpen!)}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setIsDeleteModalOpen(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {showCompletedMessage && (
        <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulse">
          ¡Acción Completada Correctamente!
        </div>
      )}

      {/* Mensaje de error */}
      {showErrorMessage && (
        <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError">
          Este usuario ya está Fuera de Servicio
        </div>
      )}
    </div>
  );
};

export default UsuariosComponent;
