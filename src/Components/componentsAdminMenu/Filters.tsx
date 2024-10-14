import React, { useState } from 'react';

interface FiltersProps {
  onFilterChange: (filterName: string, value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [modoAdquisicion, setModoAdquisicion] = useState('');
  const [estado, setEstado] = useState('');

  // Manejadores de cambio para los filtros
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombre(value);
    onFilterChange('nombre', value);
  };

  const handleUbicacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUbicacion(value);
    onFilterChange('ubicacion', value);
  };

  const handleModoAdquisicionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setModoAdquisicion(value);
    onFilterChange('modoAdquisicion', value);
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEstado(value);
    onFilterChange('estado', value);
  };

  return (
    <div className="mb-4 flex justify-between items-center">
      
      <div className="flex space-x-6">
        <div className="relative">
          <input
            type="text"
            value={nombre}
            onChange={handleNombreChange}
            placeholder="Buscar por Nombre"
            className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={ubicacion}
            onChange={handleUbicacionChange}
            placeholder="Buscar por Ubicación"
            className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs"
          />
        </div>
        <div className="relative">
          <select
            value={modoAdquisicion}
            onChange={handleModoAdquisicionChange}
            className="bg-white w-[180px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs"
          >
            <option value="">Modo Adquisición Todos</option>
            <option value="Ley">Por Ley</option>
            <option value="Donación">Por Donación</option>
          </select>
        </div>
      </div>

      {/* Filtro de estado */}
      <div className="relative">
        <select
          value={estado}
          onChange={handleEstadoChange}
          className="bg-white w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs"
        >
          <option value="">Todos los Estados</option>
          <option value="Bueno">Bueno</option>
          <option value="Regular">Regular</option>
          <option value="Malo">Malo</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;