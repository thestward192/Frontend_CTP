import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormularioActivo from './FormularioActivo'; // Asegúrate de que la ruta es correcta
import DetalleComponent from './DetalleActivo'; // Asegúrate de que la ruta es correcta

// Definimos una interfaz para describir la estructura de un activo
interface Asset {
  id: string;
  marca: string;
  modelo: string;
  ubicacion: string;
  precio: string;
  estado: string;
  descripcion: string;
  serie: string;
  modoAdquisicion: string;
  observacion: string;
  foto: string;
}

const TableComponent: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Estado para manejar los elementos seleccionados
  const [isSelectionMode, setIsSelectionMode] = useState(false); // Estado para activar/desactivar el modo de selección
  const [isSelecting, setIsSelecting] = useState(false); // Estado para manejar si está en modo de selección
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null); // Estado para manejar el activo seleccionado
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación

  const tableData: Asset[] = [
    {
      id: '4197-3561',
      marca: 'CPU',
      modelo: 'PHD-555-0118',
      ubicacion: 'LABORATORIO#1',
      precio: '35.000,00',
      estado: 'Activo',
      descripcion: 'Descripción del activo',
      serie: 'ABC123',
      modoAdquisicion: 'Compra',
      observacion: 'Observación 1',
      foto: '/ruta-imagen1.jpg'
    },
    {
      id: '4197-3092',
      marca: 'CPU',
      modelo: 'HID-555-0100',
      ubicacion: 'LABORATORIO#5',
      precio: '35.000,00',
      estado: 'Inactivo',
      descripcion: 'Descripción del activo 2',
      serie: 'DEF456',
      modoAdquisicion: 'Donación',
      observacion: 'Observación 2',
      foto: '/ruta-imagen2.jpg'
    },
    // Más datos...
  ];

  const itemsPerPage = 33; // Cantidad de elementos por página
  const totalPages = Math.ceil(tableData.length / itemsPerPage); // Calcula el número de páginas totales

  // Maneja el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = tableData.slice(startIndex, startIndex + itemsPerPage);

  // Activa el modo de selección y muestra los checkboxes
  const enableSelectionMode = () => {
    setIsSelectionMode(true);
    setIsSelecting(true);
  };

  const handleCancel = () => {
    setIsSelectionMode(false);
    setIsSelecting(false);
    setSelectedItems([]);
  };

  // Manejar la selección de un activo para mostrar más detalles
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="w-full flex justify-center py-10">
      {/* Mostrar tabla o detalle según el estado */}
      {!selectedAsset ? (
        <div
          className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
          style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="relative inline-block text-left">
              <h1 className="text-[22px] font-semibold text-black">Activos</h1>
            </div>

            {/* Botones para agregar y seleccionar */}
            <div className="flex space-x-4">
              <button
                className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus />
                <span>Agregar Activo</span>
              </button>
              {!isSelecting ? (
                <button
                  onClick={enableSelectionMode}
                  className="bg-blue-900 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-800 transition text-sm"
                >
                  Seleccionar
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition text-sm">Exportar</button>
                  <button className="bg-gray-500 text-white px-3 py-1 rounded-lg shadow hover:bg-gray-600 transition text-sm">Generar Sticker</button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:bg-red-700 transition text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filtros de productos en una línea */}
          <div className="mb-4 flex justify-between items-center">
            {/* Filtros desplegables */}
            <div className="flex space-x-6">
              <div className="relative">
                <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
                  <option>Buscar Por Leyes</option>
                </select>
              </div>

              <div className="relative">
                <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
                  <option>Buscar Por Ubicación</option>
                </select>
              </div>

              <div className="relative">
                <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
                  <option>Buscar Por Proveedor</option>
                </select>
              </div>

              <div className="relative">
                <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
                  <option>Buscar Por Licitación</option>
                </select>
              </div>

              <div className="relative">
                <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
                  <option>Buscar Por Fecha</option>
                </select>
              </div>
            </div>

            {/* Filtro de estado */}
            <div className="relative">
              <select className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs">
                <option>Mostrar Todos</option>
                <option>Productos Activos</option>
                <option>Productos Inactivos</option>
              </select>
            </div>
          </div>

          {/* Tabla con scroll */}
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {isSelectionMode && <th className="px-2 py-2 text-gray-600 font-semibold">Seleccionar</th>}
                  <th className="px-4 py-2 text-gray-600 font-semibold">No. Identificador</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Marca</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Modelo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Precio</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectAsset(row)}>
                    {isSelectionMode && (
                      <td className="px-2 py-2 text-sm">
                        <input type="checkbox" checked={selectedItems.includes(row.id)} onChange={() => setSelectedItems([...selectedItems, row.id])} />
                      </td>
                    )}
                    <td className="px-4 py-2 text-sm">{row.id}</td>
                    <td className="px-4 py-2 text-sm">{row.marca}</td>
                    <td className="px-4 py-2 text-sm">{row.modelo}</td>
                    <td className="px-4 py-2 text-sm">{row.ubicacion}</td>
                    <td className="px-4 py-2 text-sm">{row.precio}</td>
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

          {/* Paginación y total de activos */}
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

          {/* Modal */}
          {isModalOpen && <FormularioActivo onClose={() => setIsModalOpen(false)} />}
        </div>
      ) : (
        <DetalleComponent asset={selectedAsset} onBack={() => setSelectedAsset(null)} />
      )}
    </div>
  );
};

export default TableComponent;
