import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useProveedores } from '../../hooks/useProveedor';
import FormularioProveedor from './FormularioProveedor';
import DetailProveedor from './DetailProveedor';
import EditProveedorForm from './EditProveedorForm';
import { Proveedor } from '../../types/proveedor';

const ProveedoresComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const { proveedores, loading, error, getProveedorDetails, selectedProveedor, editProveedor, updateDisponibilidadProveedorMutation } = useProveedores();

  const handleUpdateDisponibilidad = async (id: number) => {
    const proveedor = proveedores.find((prov) => prov.id === id);

    // Verificar si el proveedor ya está "Fuera de Servicio"
    if (proveedor && proveedor.disponibilidad === 'Fuera de Servicio') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return; // No cerrar el modal si ya está "Fuera de Servicio"
    }

    try {
      await updateDisponibilidadProveedorMutation.mutateAsync(id);
      setShowCompletedMessage(true);
      setTimeout(() => setShowCompletedMessage(false), 3000);
      setDeleteModalOpen(null); // Cerrar el modal después de la actualización exitosa
    } catch {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  const handleViewDetails = async (id: number) => {
    await getProveedorDetails(id);
    setIsEditing(false);
    setIsDetailOpen(true);
  };

  const startEdit = () => setIsEditing(true);
  const closeDetails = () => {
    setIsEditing(false);
    setIsDetailOpen(false);
  };
  const cancelEdit = () => setIsEditing(false);

  const handleEditSave = async (id: number, updatedData: Partial<Proveedor>) => {
    await editProveedor({ id, proveedorData: updatedData });
    setIsEditing(false);
    setIsDetailOpen(false);
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Proveedores</h2>
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Proveedor</span>
          </button>
        </div>

        {error && <p className="text-red-500">Error al cargar proveedores.</p>}
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
                {proveedores?.map((proveedor, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{proveedor.nombreProveedor}</td>
                    <td className="px-4 py-2 text-sm">{proveedor.nombreEmpresa}</td>
                    <td className="px-4 py-2 text-sm">{proveedor.telefonoProveedor}</td>
                    <td className="px-4 py-2 text-sm">{proveedor.email}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleViewDetails(proveedor.id)}
                        >
                          <FaEye className="mr-1" />
                        </button>
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => setDeleteModalOpen(proveedor.id)}
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

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">Mostrando 1 a {proveedores?.length || 0} de {proveedores?.length || 0} entradas</p>
          </div>
        </div>
      </div>

      {isModalOpen && <FormularioProveedor onClose={() => setIsModalOpen(false)} />}

      {isDetailOpen && selectedProveedor && (
        isEditing ? (
          <EditProveedorForm
            proveedor={selectedProveedor}
            onSave={handleEditSave}
            onCancel={cancelEdit}
          />
        ) : (
          <DetailProveedor
            proveedor={selectedProveedor}
            onClose={closeDetails}
            onEdit={startEdit}
          />
        )
      )}

      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Actualizar Disponibilidad de Proveedor</h2>
            <p>¿Estás seguro de que deseas marcar este proveedor como "Fuera de Servicio"?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setDeleteModalOpen(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => handleUpdateDisponibilidad(deleteModalOpen!)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompletedMessage && (
        <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulse">
          Proveedor marcado como Fuera de Servicio.
        </div>
      )}

      {showErrorMessage && (
        <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError">
          El Proveedor ya está Fuera de Servicio.
        </div>
      )}
    </div>
  );
};

export default ProveedoresComponent;
