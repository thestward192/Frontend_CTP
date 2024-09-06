import React, { useState } from 'react';
import { FaEye, FaPlus, FaChevronDown } from 'react-icons/fa'; // Importamos los íconos necesarios

const TableComponent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Activos'); // Estado para manejar el desplegable
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para manejar el dropdown

  // Datos de ejemplo para la tabla
  const tableData = [
    {
      id: '4197-3567',
      marca: 'CPU',
      modelo: 'PHD-555-0118',
      ubicacion: 'LABORATORIO#1',
      precio: '35.000,00',
      estado: 'Activo',
    },
    {
      id: '4197-3095',
      marca: 'CPU',
      modelo: 'HID-555-0100',
      ubicacion: 'LABORATORIO#5',
      precio: '35.000,00',
      estado: 'Inactivo',
    },
    {
      id: '4112-9863',
      marca: 'Tips',
      modelo: 'CD-555-0107',
      ubicacion: 'LABORATORIO#3',
      precio: '35.000,00',
      estado: 'Inactivo',
    },{
        id: '4197-3567',
        marca: 'CPU',
        modelo: 'PHD-555-0118',
        ubicacion: 'LABORATORIO#1',
        precio: '35.000,00',
        estado: 'Activo',
      },
      {
        id: '4197-3095',
        marca: 'CPU',
        modelo: 'HID-555-0100',
        ubicacion: 'LABORATORIO#5',
        precio: '35.000,00',
        estado: 'Inactivo',
      },
      {
        id: '4112-9863',
        marca: 'Tips',
        modelo: 'CD-555-0107',
        ubicacion: 'LABORATORIO#3',
        precio: '35.000,00',
        estado: 'Inactivo',
      },{
        id: '4197-3567',
        marca: 'CPU',
        modelo: 'PHD-555-0118',
        ubicacion: 'LABORATORIO#1',
        precio: '35.000,00',
        estado: 'Activo',
      },
      {
        id: '4197-3095',
        marca: 'CPU',
        modelo: 'HID-555-0100',
        ubicacion: 'LABORATORIO#5',
        precio: '35.000,00',
        estado: 'Inactivo',
      },
      {
        id: '4112-9863',
        marca: 'Tips',
        modelo: 'CD-555-0107',
        ubicacion: 'LABORATORIO#3',
        precio: '35.000,00',
        estado: 'Inactivo',
      },{
          id: '4197-3567',
          marca: 'CPU',
          modelo: 'PHD-555-0118',
          ubicacion: 'LABORATORIO#1',
          precio: '35.000,00',
          estado: 'Activo',
        },
     
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-6">
          {/* Desplegable para "Activos" */}
          <div className="relative inline-block text-left">
            <button
              className="inline-flex justify-center items-center text-3xl font-bold focus:outline-none"
              onClick={toggleDropdown} // Toggle dropdown al hacer clic
            >
              {selectedCategory}
              <FaChevronDown className="ml-2 text-gray-500" />
            </button>
            {/* Desplegable oculto hasta que se haga clic */}
            {isDropdownOpen && (
              <div className="absolute mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                <ul>
                  <li
                    className={`px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer ${
                      selectedCategory === 'Activos' ? 'hidden' : ''
                    }`}
                    onClick={() => setSelectedCategory('Activos')}
                  >
                    Activos
                  </li>
                  <li
                    className={`px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer ${
                      selectedCategory === 'Licencias' ? 'hidden' : ''
                    }`}
                    onClick={() => setSelectedCategory('Licencias')}
                  >
                    Licencias
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Botón para añadir más activos (más pequeño) */}
          <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
            <FaPlus className="text-sm" />
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {/* Eliminación del checkbox en el encabezado */}
                <th className="px-4 py-2 text-gray-600 font-semibold">No. Identificador</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Marca</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Modelo</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Precio</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th> {/* Columna de acciones */}
                <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-2 text-sm">{row.id}</td>
                  <td className="px-4 py-2 text-sm">{row.marca}</td>
                  <td className="px-4 py-2 text-sm">{row.modelo}</td>
                  <td className="px-4 py-2 text-sm">{row.ubicacion}</td>
                  <td className="px-4 py-2 text-sm">{row.precio}</td>
                  <td className="px-4 py-2 text-sm">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center">
                      <FaEye className="mr-1" /> Ver {/* Ícono "Ver" */}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-3 py-1 rounded-md text-sm ${
                        row.estado === 'Activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {row.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600"></p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>

        {/* Botones de Exportar y Generar Sticker más pequeños */}
        <div className="absolute bottom-4 left-4 space-x-4">
          <button className="bg-green-600 text-white px-3 py-2 rounded-md shadow hover:bg-green-700 transition">
            Exportar
          </button>
          <button className="bg-gray-500 text-white px-3 py-2 rounded-md shadow hover:bg-gray-600 transition">
            Generar Sticker
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
