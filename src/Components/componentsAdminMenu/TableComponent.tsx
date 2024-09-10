import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormularioActivo from './FormularioActivo'; // Asegúrate de que la ruta es correcta

const TableComponent: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Estado para manejar los elementos seleccionados
  const [isSelectionMode, setIsSelectionMode] = useState(false); // Estado para activar/desactivar el modo de selección
  const [isSelecting, setIsSelecting] = useState(false); // Estado para manejar si está en modo de selección
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal

  const tableData = [
    // Datos de ejemplo para la tabla
    { id: '4197-3561', marca: 'CPU', modelo: 'PHD-555-0118', ubicacion: 'LABORATORIO#1', precio: '35.000,00', estado: 'Activo' },
    { id: '4197-3092', marca: 'CPU', modelo: 'HID-555-0100', ubicacion: 'LABORATORIO#5', precio: '35.000,00', estado: 'Inactivo' },
    { id: '4112-9863', marca: 'Tips', modelo: 'CD-555-0107', ubicacion: 'LABORATORIO#3', precio: '35.000,00', estado: 'Inactivo' },
    { id: '4197-3564', marca: 'CPU', modelo: 'PHD-555-0118', ubicacion: 'LABORATORIO#1', precio: '35.000,00', estado: 'Activo' },
    { id: '4197-3565', marca: 'CPU', modelo: 'PHD-555-0118', ubicacion: 'LABORATORIO#1', precio: '35.000,00', estado: 'Activo' },
    { id: '4197-3096', marca: 'CPU', modelo: 'HID-555-0100', ubicacion: 'LABORATORIO#5', precio: '35.000,00', estado: 'Inactivo' },
    { id: '4112-9867', marca: 'Tips', modelo: 'CD-555-0107', ubicacion: 'LABORATORIO#3', precio: '35.000,00', estado: 'Inactivo' },
    { id: '4197-3568', marca: 'CPU', modelo: 'PHD-555-0118', ubicacion: 'LABORATORIO#1', precio: '35.000,00', estado: 'Activo' },
  ];

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

  return (
    <div className="w-full flex justify-center py-10">
      <div className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative">
        <div className="flex justify-between items-center mb-4">
          {/* Título "Activos" */}
          <div className="relative inline-block text-left">
            <h1 className="text-[22px] font-semibold text-black">Activos</h1>
          </div>

          {/* Botones para agregar y seleccionar */}
          <div className="flex space-x-2">
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
              <div className="flex space-x-2">
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
        <div className="mb-4 flex items-center space-x-4">
          <p className="text-gray-700 font-semibold">Mostrar:</p>
          <label className="flex items-center space-x-2">
            <input type="radio" name="filter" value="all" className="form-radio text-blue-600" />
            <span>Todos</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="filter" value="active" className="form-radio text-blue-600" />
            <span>Productos Activos</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="filter" value="inactive" className="form-radio text-blue-600" />
            <span>Productos Inactivos</span>
          </label>
        </div>

        {/* Tabla */}
        <div className="overflow-auto">
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
              {tableData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100 cursor-pointer">
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
            <p className="text-sm text-gray-600">Total de Activos: 3270</p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && <FormularioActivo onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
};

export default TableComponent;
