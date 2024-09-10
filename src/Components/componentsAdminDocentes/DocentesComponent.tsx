import React from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa'; // Iconos para ver y borrar

const DocentesComponent: React.FC = () => {
  // Datos de ejemplo para la tabla de docentes
  const tableData = [
    {
      imagen: 'https://randomuser.me/api/portraits/men/1.jpg', // Imagen de perfil de ejemplo
      nombre: 'Carlos',
      apellido: 'Mendez',
      email: 'carlos.mendez@example.com',
      ubicacion: 'Oficina Central',
    },
    {
      imagen: 'https://randomuser.me/api/portraits/women/2.jpg',
      nombre: 'Ana',
      apellido: 'Ramírez',
      email: 'ana.ramirez@example.com',
      ubicacion: 'Laboratorio de Química',
    },
    {
      imagen: 'https://randomuser.me/api/portraits/men/3.jpg',
      nombre: 'Jorge',
      apellido: 'Pérez',
      email: 'jorge.perez@example.com',
      ubicacion: 'Oficina de Administración',
    },
    {
      imagen: 'https://randomuser.me/api/portraits/women/4.jpg',
      nombre: 'Lucía',
      apellido: 'Martínez',
      email: 'lucia.martinez@example.com',
      ubicacion: 'Biblioteca Central',
    },
    {
      imagen: 'https://randomuser.me/api/portraits/men/5.jpg',
      nombre: 'Raúl',
      apellido: 'Santos',
      email: 'raul.santos@example.com',
      ubicacion: 'Laboratorio de Física',
    },
  ];

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Docentes</h2>

          {/* Botón para añadir más docentes */}
          <button className="bg-blue-600 text-white p-3 rounded-full flex items-center hover:bg-blue-700 transition">
            <FaPlus className="text-white" />
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Imagen</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Apellido</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Email</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th> {/* Columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(0, 5).map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">
                    <img
                      src={row.imagen}
                      alt={`${row.nombre} ${row.apellido}`}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm">{row.nombre}</td>
                  <td className="px-4 py-2 text-sm">{row.apellido}</td>
                  <td className="px-4 py-2 text-sm">{row.email}</td>
                  <td className="px-4 py-2 text-sm">{row.ubicacion}</td>
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

export default DocentesComponent;
