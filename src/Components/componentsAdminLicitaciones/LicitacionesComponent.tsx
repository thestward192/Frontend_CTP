import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useLicitaciones } from '../../hooks/useLicitacion';
import DetailLicitacion from './DetailLicitacion';
import EditLicitacion from './EditLicitacion';
import FormularioLicitacion from './FormularioLicitacion';
import { Licitacion, UpdateLicitacionDTO } from '../../types/licitacion';

const LicitacionesComponent: React.FC = () => {
  const { licitaciones, loading, error, addLicitacion, removeLicitacion, editLicitacion } = useLicitaciones(); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLicitacion, setSelectedLicitacion] = useState<Licitacion | null>(null);

  const handleViewDetails = (licitacion: Licitacion) => {
    setSelectedLicitacion(licitacion);
    setIsDetailModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = async (id: number, updatedData: UpdateLicitacionDTO) => {
    await editLicitacion(id, updatedData);
    setIsEditing(false);
    setIsDetailModalOpen(false);
  };

  const closeDetails = () => {
    setIsDetailModalOpen(false);
    setIsEditing(false);
  };

  const handleAddLicitacion = async (nuevaLicitacion: Licitacion) => {
    await addLicitacion(nuevaLicitacion);
    setIsModalOpen(false);
  };

  const handleDeleteLicitacion = async (id: number) => {
    await removeLicitacion(id);
  };

  if (loading) return <p>Cargando licitaciones...</p>;
  if (error) return <p>{error}</p>;

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

        <div className="flex-grow overflow-y-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Fecha</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Licitación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nº Acta</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nº Licitación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Monto</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {licitaciones.map((licitacion) => (
                <tr key={licitacion.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm">{new Date(licitacion.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm">{licitacion.id}</td>
                  <td className="px-4 py-2 text-sm">{licitacion.numActa}</td>
                  <td className="px-4 py-2 text-sm">{licitacion.numLicitacion}</td>
                  <td className="px-4 py-2 text-sm">${licitacion.monto}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                        onClick={() => handleViewDetails(licitacion)}
                      >
                        <FaEye className="mr-1" />
                      </button>
                      <button
                        className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                        onClick={() => handleDeleteLicitacion(licitacion.id)}
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

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">Mostrando 1 a {licitaciones.length} de {licitaciones.length} entradas</p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FormularioLicitacion
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddLicitacion}
        />
      )}

      {isDetailModalOpen && selectedLicitacion && (
        isEditing ? (
          <EditLicitacion
            licitacion={selectedLicitacion}
            onSave={handleEditSave}
            onCancel={closeDetails}
          />
        ) : (
          <DetailLicitacion
            licitacion={selectedLicitacion}
            onClose={closeDetails}
            onEdit={handleEdit}
          />
        )
      )}
    </div>
  );
};

export default LicitacionesComponent;
