import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioLicitacion from './FormularioLicitacion'; // Componente del formulario
import DetailLicitacion from './DetailLicitacion'; // Componente para mostrar los detalles

// Definimos la interfaz para una licitación
interface Licitacion {
  fecha: string;
  idLicitacion: string;
  numActa: string;
  numLicitacion: string;
  nombreLicitacion: string;
  montoAutorizado: string;
  descripcion: string;
}

const LicitacionesComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal
  const [selectedLicitacion, setSelectedLicitacion] = useState<Licitacion | null>(null); // Estado para manejar la licitación seleccionada
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Estado para manejar el modal de detalles

  // Datos de ejemplo para la tabla de licitaciones
  const tableData: Licitacion[] = [
    {
      fecha: '10/09/2024',
      idLicitacion: 'LIC-001',
      numActa: 'ACT-5678',
      numLicitacion: 'L-2024-009',
      nombreLicitacion: 'Construcción de Puente',
      montoAutorizado: '$500,000',
      descripcion: 'Construcción de puente vehicular en zona rural.',
    },
    {
      fecha: '11/09/2024',
      idLicitacion: 'LIC-002',
      numActa: 'ACT-5679',
      numLicitacion: 'L-2024-010',
      nombreLicitacion: 'Compra de Equipos Médicos',
      montoAutorizado: '$300,000',
      descripcion: 'Adquisición de equipos médicos para hospital.',
    },
    {
      fecha: '12/09/2024',
      idLicitacion: 'LIC-003',
      numActa: 'ACT-5680',
      numLicitacion: 'L-2024-011',
      nombreLicitacion: 'Reparación de Carreteras',
      montoAutorizado: '$1,200,000',
      descripcion: 'Reparación y mantenimiento de carreteras en la región sur.',
    },
    {
      fecha: '13/09/2024',
      idLicitacion: 'LIC-004',
      numActa: 'ACT-5681',
      numLicitacion: 'L-2024-012',
      nombreLicitacion: 'Suministro de Alimentos',
      montoAutorizado: '$200,000',
      descripcion: 'Suministro de alimentos para instituciones públicas.',
    },
    {
      fecha: '14/09/2024',
      idLicitacion: 'LIC-005',
      numActa: 'ACT-5682',
      numLicitacion: 'L-2024-013',
      nombreLicitacion: 'Construcción de Hospital',
      montoAutorizado: '$2,500,000',
      descripcion: 'Construcción de hospital en la ciudad capital.',
    },
  ];

  // Función para abrir el modal de detalles
  const handleViewDetails = (licitacion: Licitacion) => {
    setSelectedLicitacion(licitacion);
    setIsDetailModalOpen(true);
  };

  // Función para editar (por ahora solo un placeholder)
  const handleEditLicitacion = () => {
    console.log('Editar licitación:', selectedLicitacion);
  };

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
                <th className="px-4 py-2 text-gray-600 font-semibold">ID Licitación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nº Acta</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nº Licitación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Monto Autorizado</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm">{row.fecha}</td>
                  <td className="px-4 py-2 text-sm">{row.idLicitacion}</td>
                  <td className="px-4 py-2 text-sm">{row.numActa}</td>
                  <td className="px-4 py-2 text-sm">{row.numLicitacion}</td>
                  <td className="px-4 py-2 text-sm">{row.montoAutorizado}</td>
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
            <p className="text-sm text-gray-600">Mostrando 1 a 5 de 5 entradas</p>
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
