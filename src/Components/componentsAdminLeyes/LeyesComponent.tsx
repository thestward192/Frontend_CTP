import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioLey from './FormularioLey'; // Importamos el componente del formulario
import { useLeyes } from '../../hooks/useLey'; // Importamos el hook para manejar leyes
import DetailLey from './DetailLey'; // Importamos el componente de detalles

const LeyesComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal de creación
  const [detailModalOpen, setDetailModalOpen] = useState(false); // Estado para manejar la apertura del modal de detalles
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null); // Estado para manejar la eliminación

  const { leyes, loading, error, getLeyDetails, selectedLey, removeLey } = useLeyes();

  const handleDelete = async (id: number) => {
    await removeLey(id);
    setDeleteModalOpen(null); // Cerrar el modal después de eliminar
  };

  const handleViewDetails = async (id: number) => {
    await getLeyDetails(id); // Obtener detalles de la ley
    setDetailModalOpen(true); // Mostrar el modal de detalles
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Leyes</h2>

          {/* Botón para añadir más leyes */}
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Ley</span>
          </button>
        </div>

        {/* Mostrar error si existe */}
        {error && <p className="text-red-500">Error al cargar leyes.</p>}

        {/* Indicador de carga */}
        {loading ? (
          <p>Cargando leyes...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">ID Ley</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nº Ley</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Detalle</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {leyes.map((ley, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{ley.id}</td>
                    <td className="px-4 py-2 text-sm">{ley.numLey}</td>
                    <td className="px-4 py-2 text-sm">{ley.nombre}</td>
                    <td className="px-4 py-2 text-sm truncate max-w-xs">{ley.detalle}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        {/* Botón de ver detalles */}
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => handleViewDetails(ley.id)} // Mostrar detalles
                        >
                          <FaEye className="mr-1" />
                        </button>

                        {/* Botón de eliminar */}
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center"
                          onClick={() => setDeleteModalOpen(ley.id)} // Mostrar modal de confirmación
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
            <p className="text-sm text-gray-600">
              Mostrando 1 a {leyes.length} de {leyes.length} entradas
            </p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal para agregar ley */}
      {isModalOpen && <FormularioLey onClose={() => setIsModalOpen(false)} />}

      {/* Modal para ver detalles de una ley */}
      {detailModalOpen && selectedLey && (
        <DetailLey ley={selectedLey} onClose={() => setDetailModalOpen(false)} />
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">¿Deseas eliminar esta ley?</h2>
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

export default LeyesComponent;
