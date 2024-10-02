import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioDocente from './FormularioDocente';
import FormularioEditarUsuario from './FormularioEditarUsuario';
import { User } from '../../types/user';
import { useUsers } from '../../hooks/useUser';
import DetailUsuarios from './DetailDocente';

const UsuariosComponent: React.FC = () => {
  const { users, loading, error, removeUserMutation, editUserMutation } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<number | null>(null);

  const handleViewDetails = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleDelete = (userId: number) => {
    setIsDeleteModalOpen(userId);
  };

  const confirmDelete = async () => {
    if (isDeleteModalOpen !== null) {
      try {
        await removeUserMutation.mutateAsync(isDeleteModalOpen);
        setIsDeleteModalOpen(null);
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }
  };

  const handleSaveEdit = async (userId: number, updatedData: Partial<User>) => {
    try {
      await editUserMutation.mutateAsync({ userId, updatedData });
      setIsEditModalOpen(null); // Cierra el modal de edición después de guardar
      setSelectedUser(null); // Cierra también el modal de detalles
    } catch (error) {
      console.error('Error al editar el usuario:', error);
    }
  };

  const handleEditFromDetail = (userId: number) => {
    setIsEditModalOpen(userId); // Abre el modal de edición
    setSelectedUser(null); // Cierra el modal de detalles
  };

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div>Error al cargar los usuarios: {error instanceof Error ? error.message : 'Ocurrió un error desconocido'}</div>;
  }

  if (!users || users.length === 0) {
    return <div>No hay usuarios disponibles</div>;
  }

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>

          {/* Botón para añadir más usuarios */}
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Usuario</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Apellido Paterno</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Apellido Materno</th>
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
                        onClick={() => handleDelete(user.id)}
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

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">Mostrando 1 a {users.length} de {users.length} entradas</p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal para agregar usuario */}
      {isModalOpen && <FormularioDocente onClose={() => setIsModalOpen(false)} />}

      {/* Modal para ver detalles del usuario */}
      {selectedUser !== null && (
        <DetailUsuarios
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={handleEditFromDetail} // Pasamos la función aquí
        />
      )}

      {/* Modal para editar usuario */}
      {isEditModalOpen !== null && (
        <FormularioEditarUsuario
          userId={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(null);
            setSelectedUser(null); // Cierra también el modal de detalles
          }}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal para confirmar eliminación */}
      {isDeleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Eliminar Usuario</h2>
            <p>¿Estás seguro de que deseas eliminar este Usuario?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setIsDeleteModalOpen(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosComponent;

