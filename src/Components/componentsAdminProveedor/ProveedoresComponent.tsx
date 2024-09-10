import React from 'react';
import {  FaTrash, FaPlus, FaEye } from 'react-icons/fa'; // Iconos para editar y borrar

const ProveedoresComponent: React.FC = () => {
  // Datos de ejemplo para la tabla
  const tableData = [
    {
      nombre: 'Intel',
      cedula: '1-0145-0876',
      correo: 'Intel@gmail.com',
      direccion: 'Proveedor Seleccionado',
    },
    {
      nombre: 'Intel',
      cedula: '1-0145-0876',
      correo: 'Intel@gmail.com',
      direccion: 'Proveedor Seleccionado',
    },
    {
      nombre: 'Intel',
      cedula: '1-0145-0876',
      correo: 'Intel@gmail.com',
      direccion: 'Proveedor Seleccionado',
    },
    {
      nombre: 'Intel',
      cedula: '1-0145-0876',
      correo: 'Intel@gmail.com',
      direccion: 'Proveedor Seleccionado',
    },
  ];

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Proveedores</h2>

          {/* Botón para añadir más proveedores */}
          <button className="bg-blue-600 text-white p-3 rounded-full flex items-center hover:bg-blue-700 transition">
            <FaPlus className="text-white" />
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Cédula</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Correo</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Dirección</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th> {/* Columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{row.nombre}</td>
                  <td className="px-4 py-2 text-sm">{row.cedula}</td>
                  <td className="px-4 py-2 text-sm">{row.correo}</td>
                  <td className="px-4 py-2 text-sm">{row.direccion}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex space-x-2">
                      {/* Botón de editar */}
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center">
                        <FaEye className="mr-1" /> {/* Icono editar */}
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
            <p className="text-sm text-gray-600">Mostrando 1 a 4 de 4 entradas</p>
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

export default ProveedoresComponent;
