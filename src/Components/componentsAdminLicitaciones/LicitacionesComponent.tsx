import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useLicitaciones } from '../../hooks/useLicitacion'; // Importa el hook personalizado
import DetailLicitacion from './DetailLicitacion'; // Componente para mostrar los detalles
import { Licitacion } from '../../types/licitacion';
import FormularioLicitacion from './FormularioLicitacion';

const LicitacionesComponent: React.FC = () => {
  const { licitaciones, loading, error } = useLicitaciones(); // Usa el hook para obtener las licitaciones
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal
  const [selectedLicitacion, setSelectedLicitacion] = useState<Licitacion | null>(null); // Estado para manejar la licitación seleccionada
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Estado para manejar el modal de detalles

  // Función para abrir el modal de detalles
  const handleViewDetails = (licitacion: Licitacion) => {
    setSelectedLicitacion(licitacion);
    setIsDetailModalOpen(true);
  };

  // Función para editar (por ahora solo un placeholder)
  const handleEditLicitacion = () => {
    console.log('Editar licitación:', selectedLicitacion);
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

          {/* Botón para añadir más licitaciones */}
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
              {licitaciones.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm">{row.fecha}</td>
                  <td className="px-4 py-2 text-sm">{row.id}</td>
                  <td className="px-4 py-2 text-sm">{row.numActa}</td>
                  <td className="px-4 py-2 text-sm">{row.numLicitacion}</td>
                  <td className="px-4 py-2 text-sm">{row.monto}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex space-x-2">
                      {/* Botón de ver detalles */}
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                        onClick={() => handleViewDetails(row)} // Abrir el modal de detalles
                      >
                        <FaEye className="mr-1" />
                      </button>

                      {/* Botón de borrar */}
                      <button className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center">
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
            <p className="text-sm text-gray-600">Mostrando 1 a {licitaciones.length} de {licitaciones.length} entradas</p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal para agregar licitación */}
      {isModalOpen && <FormularioLicitacion onClose={() => setIsModalOpen(false)} />}

      {/* Modal para ver detalles */}
      {isDetailModalOpen && selectedLicitacion && (
        <DetailLicitacion
          licitacion={selectedLicitacion}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={handleEditLicitacion}
        />
      )}
    </div>
  );
};

export default LicitacionesComponent;
