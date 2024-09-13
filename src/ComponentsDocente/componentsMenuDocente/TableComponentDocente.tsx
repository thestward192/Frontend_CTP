import React, { useState } from 'react';

// Definimos una interfaz para describir la estructura de un activo
interface Asset {
  id: string;
  marca: string;
  modelo: string;
  serie: string;
  estado: string;
}

const TableComponentDocente: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación

  const tableData: Asset[] = [
    {
      id: '4197-3561',
      marca: 'CPU',
      modelo: 'PHD-555-0118',
      serie: 'ABC123',
      estado: 'Activo',
    },
    {
      id: '4197-3092',
      marca: 'CPU',
      modelo: 'HID-555-0100',
      serie: 'DEF456',
      estado: 'Inactivo',
    },
    {
      id: '4197-3563',
      marca: 'Monitor',
      modelo: 'MON-555-0101',
      serie: 'GHI789',
      estado: 'Activo',
    },
    // Más datos...
  ];

  const itemsPerPage = 5; // Cantidad de elementos por página
  const totalPages = Math.ceil(tableData.length / itemsPerPage); // Calcula el número de páginas totales

  // Maneja el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = tableData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-4">
          <div className="relative inline-block text-left">
            <h1 className="text-[22px] font-semibold text-black">Activos Aula #1</h1>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">No. Identificador</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Marca</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Modelo</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Serie</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm">{row.id}</td>
                  <td className="px-4 py-2 text-sm">{row.marca}</td>
                  <td className="px-4 py-2 text-sm">{row.modelo}</td>
                  <td className="px-4 py-2 text-sm">{row.serie}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-3 py-1 rounded-md text-sm ${row.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
            <p className="text-sm text-gray-600">Total de Activos: {tableData.length}</p>
          </div>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableComponentDocente;
