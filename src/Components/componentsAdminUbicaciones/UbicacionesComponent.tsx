import React from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa'; // Iconos para ver y borrar

const UbicacionesComponent: React.FC = () => {
  // Datos de ejemplo para la tabla de ubicaciones
  const tableData = [
    {
      idUbicacion: 'UBI-001',
      nombreUbicacion: 'Laboratorio de Informática',
      pabellon: 'A',
      descripcion: 'Ubicado en el primer piso del pabellón A.',
    },
    {
      idUbicacion: 'UBI-002',
      nombreUbicacion: 'Biblioteca Central',
      pabellon: 'B',
      descripcion: 'Sala de lectura y préstamos de libros.',
    },
    {
      idUbicacion: 'UBI-003',
      nombreUbicacion: 'Oficina de Recursos Humanos',
      pabellon: 'C',
      descripcion: 'Oficina encargada de la gestión de personal.',
    },
    {
      idUbicacion: 'UBI-004',
      nombreUbicacion: 'Cafetería',
      pabellon: 'D',
      descripcion: 'Cafetería para estudiantes y personal.',
    },
    {
      idUbicacion: 'UBI-005',
      nombreUbicacion: 'Auditorio Principal',
      pabellon: 'E',
      descripcion: 'Sala de eventos y conferencias.',
    },
  ];

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Ubicaciones</h2>

          {/* Botón para añadir más ubicaciones */}
          <button className="bg-blue-600 text-white p-3 rounded-full flex items-center hover:bg-blue-700 transition">
            <FaPlus className="text-white" />
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">ID Ubicación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nombre Ubicación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Pabellón</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Descripción</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th> {/* Columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(0, 5).map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{row.idUbicacion}</td>
                  <td className="px-4 py-2 text-sm">{row.nombreUbicacion}</td>
                  <td className="px-4 py-2 text-sm">{row.pabellon}</td>
                  <td className="px-4 py-2 text-sm truncate max-w-xs">{row.descripcion}</td> {/* Campo descripción más pequeño */}
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

export default UbicacionesComponent;
