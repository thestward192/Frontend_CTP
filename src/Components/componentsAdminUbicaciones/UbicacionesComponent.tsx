// UbicacionesComponent.tsx
import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import FormularioUbicacion from './FormularioUbicacion';
import DetailUbicacion from './DetailUbicacion';
import EditUbicacionForm from './EditUbicacion';
import { useUbicacion } from '../../hooks/useUbicacion';

const UbicacionesComponent: React.FC = () => {
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
    setDetailModalOpen(id); // ✅ Cambiado a `true`
  };

  const handleEditClick = async (id: number) => {
    await getUbicacionDetails(id);
    setIsEditing(true);
    setDetailModalOpen(id); // ✅ Cambiado a `true`
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
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Ubicación</span>
          </button>
        </div>

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
                {ubicaciones.map((ubicacion) => (
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

        {/* Mensajes de Estado */}
        {showCompletedMessage && (
          <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulse">
            Acción Completada Correctamente!
          </div>
        )}
        {showErrorMessage && (
          <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError">
            Esta ubicación ya está Fuera de Servicio
          </div>
        )}
      </div>

      {isModalOpen && (
        <FormularioUbicacion onClose={() => setIsModalOpen(false)} onUbicacionCreated={handleUbicacionCreated} />
      )}
      {detailModalOpen && selectedUbicacion && (
        isEditing ? (
          <EditUbicacionForm ubicacion={selectedUbicacion} onSave={handleEditSave} onCancel={closeDetails} />
        ) : (
          <DetailUbicacion ubicacion={selectedUbicacion} onClose={closeDetails} />
        )
      )}
    </div>
  );
};

export default UbicacionesComponent;
