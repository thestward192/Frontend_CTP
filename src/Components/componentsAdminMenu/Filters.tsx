import React from 'react';

//interface FiltersProps {}

const Filters: React.FC = () => {
  return (
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
  );
};

export default Filters;
