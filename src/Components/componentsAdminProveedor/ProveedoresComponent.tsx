import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useProveedores } from '../../hooks/useProveedor'; // Importamos el hook
import FormularioProveedor from './FormularioProveedor';
import DetailProveedor from './DetailProveedor'; // Importamos el nuevo componente

const ProveedoresComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);

  const { proveedores, loading, error, getProveedorDetails, selectedProveedor, removeProveedor } = useProveedores();

  const handleDelete = async (id: number) => {
    await removeProveedor(id);
    setDeleteModalOpen(null); // Cerrar el modal después de eliminar
  };

  const handleViewDetails = async (id: number) => {
    await getProveedorDetails(id); // Obtener detalles del proveedor
    setDetailModalOpen(true); // Mostrar el modal de detalles
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Proveedores</h2>

          {/* Botón para añadir más proveedores */}
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Proveedor</span>
          </button>
        </div>

        {/* Mostrar error si existe */}
        {error && <p className="text-red-500">Error al cargar proveedores.</p>}

        {/* Indicador de carga */}
        {loading ? (
          <p>Cargando proveedores...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre del Proveedor</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre de la Empresa</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Teléfono</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Correo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((proveedor, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{proveedor.nombreProveedor}</td>
                    <td className="px-4 py-2 text-sm">{proveedor.nombreEmpresa}</td>
                    <td className="px-4 py-2 text-sm">{proveedor.telefonoProveedor}</td>
                    <td className="px-4 py-2 text-sm">{proveedor.email}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        {/* Botón para ver detalles */}
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleViewDetails(proveedor.id)} // Muestra detalles al hacer clic
                        >
                          <FaEye className="mr-1" />
                        </button>

                        {/* Botón para borrar */}
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => setDeleteModalOpen(proveedor.id)} // Muestra modal de confirmación para eliminar
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

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">Mostrando 1 a {proveedores.length} de {proveedores.length} entradas</p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal para agregar proveedor */}
      {isModalOpen && <FormularioProveedor onClose={() => setIsModalOpen(false)} />}

      {/* Modal para ver detalles de un proveedor */}
      {detailModalOpen && selectedProveedor && (
        <DetailProveedor proveedor={selectedProveedor} onClose={() => setDetailModalOpen(false)} />
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">¿Deseas eliminar este proveedor?</h2>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setDeleteModalOpen(null)} // Cerrar sin eliminar
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => handleDelete(deleteModalOpen!)} // Confirmar eliminación
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

export default ProveedoresComponent;
