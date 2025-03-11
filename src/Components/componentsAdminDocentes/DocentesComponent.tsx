import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioDocente from './FormularioDocente';
import FormularioEditarUsuario from './FormularioEditarUsuario';
import { User } from '../../types/user';
import { useUsers } from '../../hooks/useUser';
import DetailUsuarios from './DetailDocente';

const UsuariosComponent: React.FC = () => {
  const { users = [], loading, error, updateDisponibilidadMutation, editUserMutation } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<number | null>(null);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleViewDetails = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleUpdateAvailability = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    
    // Si el usuario ya está "Fuera de Servicio", mostramos el mensaje de error y no cerramos el modal
    if (user && user.disponibilidad === 'Fuera de Servicio') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }

    // Actualización de disponibilidad a "Fuera de Servicio"
    await updateDisponibilidadMutation.mutateAsync(userId);
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
    setIsDeleteModalOpen(null); // Cerrar modal tras éxito
  };

  const handleSaveEdit = async (userId: number, updatedData: Partial<User>) => {
    try {
      await editUserMutation.mutateAsync({ userId, updatedData });
      setIsEditModalOpen(null); // Cerrar modal de edición tras guardar
      setSelectedUser(null); // Cerrar modal de detalles
    } catch (error) {
      console.error('Error al editar el usuario:', error);
    }
  };

  const handleEditFromDetail = (userId: number) => {
    setIsEditModalOpen(userId); // Abre el modal de edición
    setSelectedUser(null); // Cierra el modal de detalles
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
          <div>Error al cargar los usuarios: {error instanceof Error ? error.message : 'Ocurrió un error desconocido'}</div>
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
                {users.map((user) => (
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
            Acción Completada Correctamente!
          </div>
        )}

        {/* Mensaje de error si el usuario ya está fuera de servicio */}
        {showErrorMessage && (
          <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError">
            Este usuario ya está Fuera de Servicio
          </div>
        )}
      </div>

      {/* Otros modales */}
      {isModalOpen && <FormularioDocente onClose={() => setIsModalOpen(false)} />}
      {selectedUser !== null && (
        <DetailUsuarios
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={handleEditFromDetail}
        />
      )}
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
    </div>
  );
};

export default UsuariosComponent;
