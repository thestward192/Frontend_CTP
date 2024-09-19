import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioDocente from './FormularioDocente';
import { useUsers } from '../../hooks/useUser';
import DetailUsuarios from './DetailDocente';

const UsuariosComponent: React.FC = () => {
  const { users, loading, error, removeUser } = useUsers(); // Añadimos removeUser para eliminar usuarios
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal de creación
  const [selectedUser, setSelectedUser] = useState<number | null>(null); // Estado para manejar el usuario seleccionado
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<number | null>(null); // Estado para manejar la apertura del modal de eliminación

  const handleViewDetails = (userId: number) => {
    setSelectedUser(userId); // Mostrar detalles del usuario seleccionado
  };

  const handleDelete = (userId: number) => {
    setIsDeleteModalOpen(userId); // Mostrar el modal de confirmación de eliminación
  };

  const confirmDelete = () => {
    if (isDeleteModalOpen !== null) {
      removeUser(isDeleteModalOpen);
      setIsDeleteModalOpen(null); // Cerrar el modal de eliminación
    }
  };

  const handleEdit = () => {
    console.log('Editar usuario', selectedUser);
  };

  if (loading) {
    return <div>Cargando usuarios...</div>; // Mostrar mensaje de carga mientras se obtienen los usuarios
  }

  if (error) {
    return <div>Error: {error}</div>; // Mostrar mensaje de error si ocurre algún problema
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
          onEdit={handleEdit}
        />
      )}

      {/* Modal para confirmar eliminación */}
      {isDeleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Eliminar Usuario</h2>
            <p>¿Estás seguro de que deseas eliminar este usuario?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsDeleteModalOpen(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md"
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
