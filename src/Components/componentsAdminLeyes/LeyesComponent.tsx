import React from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa'; // Iconos para ver y borrar

const LeyesComponent: React.FC = () => {
  // Datos de ejemplo para la tabla de leyes
  const tableData = [
    {
      idLey: 'LEY-001',
      numLey: 'L-2024-01',
      nombre: 'Ley de Protección de Datos',
      detalle: 'Esta ley regula el tratamiento de los datos personales.',
    },
    {
      idLey: 'LEY-002',
      numLey: 'L-2024-02',
      nombre: 'Ley de Contrataciones Públicas',
      detalle: 'Norma los procesos de contratación en instituciones públicas.',
    },
    {
      idLey: 'LEY-003',
      numLey: 'L-2024-03',
      nombre: 'Ley de Presupuesto Nacional',
      detalle: 'Regula el uso y distribución del presupuesto del Estado.',
    },
    {
      idLey: 'LEY-004',
      numLey: 'L-2024-04',
      nombre: 'Ley de Seguridad Social',
      detalle: 'Establece los derechos y deberes en materia de seguridad social.',
    },
    {
      idLey: 'LEY-005',
      numLey: 'L-2024-05',
      nombre: 'Ley de Energías Renovables',
      detalle: 'Fomenta el uso de energías renovables en el país.',
    },
  ];

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Leyes</h2>

          {/* Botón para añadir más leyes */}
          <button className="bg-blue-600 text-white p-3 rounded-full flex items-center hover:bg-blue-700 transition">
            <FaPlus className="text-white" />
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">ID Ley</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nº Ley</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Detalle</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th> {/* Columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(0, 5).map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{row.idLey}</td>
                  <td className="px-4 py-2 text-sm">{row.numLey}</td>
                  <td className="px-4 py-2 text-sm">{row.nombre}</td>
                  <td className="px-4 py-2 text-sm truncate max-w-xs">{row.detalle}</td> {/* Campo detalle más pequeño */}
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
    </div>
  );
};

export default LeyesComponent;
