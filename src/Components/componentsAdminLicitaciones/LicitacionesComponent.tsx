import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioLicitacion from './FormularioLicitacion'; // Importamos el componente del formulario

const LicitacionesComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal

  // Datos de ejemplo para la tabla de licitaciones
  const tableData = [
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

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
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

        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Fecha</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">ID Licitación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nº Acta</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nº Licitación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Monto Autorizado</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th> {/* Columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(0, 5).map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{row.fecha}</td>
                  <td className="px-4 py-2 text-sm">{row.idLicitacion}</td>
                  <td className="px-4 py-2 text-sm">{row.numActa}</td>
                  <td className="px-4 py-2 text-sm">{row.numLicitacion}</td>
                  <td className="px-4 py-2 text-sm">{row.montoAutorizado}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex space-x-2">
                      {/* Botón de ver */}
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center">
                        <FaEye className="mr-1" /> {/* Icono ver */}
                      </button>
                      {/* Botón de borrar */}
                      <button className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center">
                        <FaTrash className="mr-1" /> {/* Icono borrar */}
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
    </div>
  );
};

export default LicitacionesComponent;
