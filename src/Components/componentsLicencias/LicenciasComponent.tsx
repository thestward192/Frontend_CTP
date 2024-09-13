import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioLicencia from './FormularioLicencia'; // Importamos el formulario de Licencia

const LicenciasComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos de ejemplo para la tabla
  const tableData = [
    {
      nombre: 'Microsoft Office',
      descripcion: 'Licencia de Microsoft Office 365 para 5 dispositivos',
      codigoLicencia: 'OFF-365-2023',
    },
    {
      nombre: 'Adobe Photoshop',
      descripcion: 'Licencia para Adobe Photoshop CC',
      codigoLicencia: 'PS-2023-Adobe',
    },
    {
      nombre: 'AutoCAD',
      descripcion: 'Licencia de Autodesk AutoCAD para uso comercial',
      codigoLicencia: 'CAD-2023-Auto',
    },
  ];

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Licencias</h2>

          {/* Botón para añadir más licencias */}
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Licencia</span>
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Descripción</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Código de Licencia</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th> {/* Columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{row.nombre}</td>
                  <td className="px-4 py-2 text-sm">{row.descripcion}</td>
                  <td className="px-4 py-2 text-sm">{row.codigoLicencia}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex space-x-2">
                      {/* Botón de ver */}
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center">
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
            <p className="text-sm text-gray-600">Mostrando 1 a 3 de 3 entradas</p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal para agregar licencia */}
      {isModalOpen && (
        <FormularioLicencia onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default LicenciasComponent;
