import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useLicencias } from '../../hooks/useLicencia';
import FormularioLicencia from './FormularioLicencia';
import DetailLicencia from './DetailLicencia';
import { CreateLicenciaDTO, Licencia } from '../../types/licencia';


const LicenciasComponent: React.FC = () => {
  const { licencias, loading, error, addLicencia, removeLicencia } = useLicencias();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLicencia, setSelectedLicencia] = useState<Licencia | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null); // Estado para controlar el modal

  const handleViewDetails = (licencia: Licencia) => {
    setSelectedLicencia(licencia);
  };

  const handleDelete = async (id: number) => {
    await removeLicencia(id);
  };

  const handleAddLicencia = async (licencia: CreateLicenciaDTO) => {
    await addLicencia(licencia);
    setIsModalOpen(false); // Cierra el modal después de agregar la licencia
  };

  const handleCloseDetail = () => {
    setSelectedLicencia(null);
  };

  if (loading) return <p>Cargando licencias...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Licencias</h2>

          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Licencia</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Descripción</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Código de Licencia</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Modo Adquisición</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {licencias?.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm">{row.nombre}</td>
                  <td className="px-4 py-2 text-sm">{row.descripcion}</td>
                  <td className="px-4 py-2 text-sm">{row.codigoLicencia}</td>
                  <td className="px-4 py-2 text-sm">{row.modoAdquisicion}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                        onClick={() => handleViewDetails(row)}
                      >
                        <FaEye className="mr-1" />
                      </button>
                      <button
                        className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                        onClick={() => setDeleteModalOpen(row.id)} // Abre el modal y almacena el id
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
            <p className="text-sm text-gray-600">Mostrando {licencias?.length || 0} entradas</p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FormularioLicencia 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddLicencia} // Pasar la función onSave aquí
        />
      )}

      {selectedLicencia && (
        <DetailLicencia
          licencia={selectedLicencia}
          onClose={handleCloseDetail} // Cierra el detalle
        />
      )}

      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Eliminar Licencia</h2>
            <p>¿Estás seguro de que deseas eliminar esta Licencia?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setDeleteModalOpen(null)} // Cierra el modal
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => {
                  handleDelete(deleteModalOpen!); // Llama a handleDelete con el id
                  setDeleteModalOpen(null); // Cierra el modal después de eliminar
                }}
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

export default LicenciasComponent;
