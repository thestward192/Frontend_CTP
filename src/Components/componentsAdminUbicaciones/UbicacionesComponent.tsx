import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioUbicacion from './FormularioUbicacion';
import DetailUbicacion from './DetailUbicacion';
import EditUbicacionForm from './EditUbicacion';
import { useUbicacion } from '../../hooks/useUbicacion';
import { Ubicacion } from '../../types/ubicacion';

const UbicacionesComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  // Estado para el mensaje de error

  const {
    ubicaciones,
    loading,
    error,
    removeUbicacion,
    editUbicacion,
    getUbicacionDetails,
  } = useUbicacion();

  useEffect(() => {
    if (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [error]);

  const handleDelete = async (id: number) => {
    await removeUbicacion(id);
    setDeleteModalOpen(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const closeDetails = () => {
    setIsEditing(false);
    setDetailModalOpen(null);
    setSelectedUbicacion(null);
  };

  const handleEditSave = async (id: number, updatedData: Partial<Ubicacion>) => {
    await editUbicacion(id, updatedData);
    setIsEditing(false);
    setDetailModalOpen(null);
    setSelectedUbicacion(null);
  };

  const handleSelectUbicacion = async (id: number) => {
    const ubicacion = await getUbicacionDetails(id);
    setSelectedUbicacion(ubicacion);
    setDetailModalOpen(id);
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

        {errorMessage && <p className="text-red-500">Error al cargar ubicaciones: {errorMessage}</p>}

        {loading ? (
          <p>Cargando ubicaciones...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">ID Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Pabellón</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Descripción</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ubicaciones.map((ubicacion, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{ubicacion.id}</td>
                    <td className="px-4 py-2 text-sm">{ubicacion.nombre}</td>
                    <td className="px-4 py-2 text-sm">{ubicacion.pabellon}</td>
                    <td className="px-4 py-2 text-sm truncate max-w-xs">{ubicacion.descripcion}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleSelectUbicacion(ubicacion.id)}
                        >
                          <FaEye className="mr-1" />
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

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">
              Mostrando 1 a {ubicaciones.length} de {ubicaciones.length} entradas
            </p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FormularioUbicacion onClose={() => setIsModalOpen(false)} />
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
            onEdit={handleEdit}
          />
        )
      )}

      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Eliminar Ubicación</h2>
            <p>¿Estás seguro de que deseas eliminar esta Ubicación?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setDeleteModalOpen(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => handleDelete(deleteModalOpen)}
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

export default UbicacionesComponent;
