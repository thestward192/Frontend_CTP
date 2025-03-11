import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useLicitaciones } from '../../hooks/useLicitacion';
import DetailLicitacion from './DetailLicitacion';
import EditLicitacion from './EditLicitacion';
import FormularioLicitacion from './FormularioLicitacion';
import { Licitacion } from '../../types/licitacion';

const LicitacionesComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const { 
    licitaciones, 
    loading, 
    error, 
    fetchLicitacionById, 
    selectedLicitacion, 
    editLicitacion, 
    updateDisponibilidad,
    addLicitacion 
  } = useLicitaciones();

  const handleLicitacionCreated = () => {
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
  };

  const handleSubmit = async (licitacion: Omit<Licitacion, 'id'>) => {
    await addLicitacion(licitacion);
    handleLicitacionCreated();
    setIsModalOpen(false);
  };

  const handleLicitacionEdited = () => {
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
  };

  const handleUpdateDisponibilidad = async (id: number) => {
    const licitacion = licitaciones.find((l) => l.id === id);

    // Verificar si la licitación ya está fuera de servicio
    if (licitacion && licitacion.disponibilidad === 'Fuera de Servicio') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }

    await updateDisponibilidad(id);
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
    setDeleteModalOpen(null);
  };

  const handleViewDetails = async (id: number) => {
    await fetchLicitacionById(id);
    setIsEditing(false);
    setDetailModalOpen(true);
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-CR").format(monto);
  };

  const startEdit = () => setIsEditing(true);
  const closeDetails = () => {
    setIsEditing(false);
    setDetailModalOpen(false);
  };
  const cancelEdit = () => setIsEditing(false);

  const handleEditSave = async (id: number, updatedData: Partial<Licitacion>) => {
    await editLicitacion(id, updatedData); // Pasamos `id` y `updatedData` como dos argumentos
    handleLicitacionEdited();
    setIsEditing(false);
    setDetailModalOpen(false);
};


  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Licitaciones</h2>

          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Licitación</span>
          </button>
        </div>

        {error && <p className="text-red-500">Error al cargar licitaciones.</p>}
        {loading ? (
          <p>Cargando licitaciones...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nº Acta</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nº Licitación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Monto</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {licitaciones?.map((licitacion) => (
                  <tr key={licitacion.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{new Date(licitacion.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm">{licitacion.numActa}</td>
                    <td className="px-4 py-2 text-sm">{licitacion.numLicitacion}</td>
                    <td className="px-4 py-2 text-sm">
                      {licitacion.moneda === "CRC" ? "₡" : "$"}
                      {licitacion.monto.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
                      </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleViewDetails(licitacion.id)}
                        >
                          <FaEye className="mr-1" />
                        </button>
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => setDeleteModalOpen(licitacion.id)}
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
          <p className="text-sm text-gray-600">Mostrando 1 a {licitaciones?.length || 0} de {licitaciones?.length || 0} entradas</p>
        </div>
      </div>

      {isModalOpen && (
         <FormularioLicitacion 
         onClose={() => setIsModalOpen(false)} 
         onLicitacionCreated={handleLicitacionCreated} 
         onSubmit={handleSubmit} // Pasamos `handleSubmit` como `onSubmit`
       />
      )}

      {detailModalOpen && selectedLicitacion && (
        isEditing ? (
          <EditLicitacion
            licitacion={selectedLicitacion}
            onSave={handleEditSave}
            onCancel={cancelEdit}
          />
        ) : (
          <DetailLicitacion
            licitacion={selectedLicitacion}
            onClose={closeDetails}
            onEdit={startEdit}
          />
        )
      )}

      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Actualizar Disponibilidad de Licitación</h2>
            <p>¿Estás seguro de que deseas cambiar la disponibilidad de esta Licitación?</p>

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
        <div
          className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulse"
        >
          Acción Completada Correctamente!
        </div>
      )}

      {showErrorMessage && (
        <div
          className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError"
        >
          Esta licitación ya está Fuera de Servicio
        </div>
      )}
    </div>
  );
};

export default LicitacionesComponent;
