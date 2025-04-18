// src/components/FilterDisponibilidad.tsx
import React from 'react';

interface FilterDisponibilidadProps {
  value: 'Todos' | 'En Servicio' | 'Fuera de Servicio';
  onChange: (nuevoFiltro: 'Todos' | 'En Servicio' | 'Fuera de Servicio') => void;
}

const FilterDisponibilidad: React.FC<FilterDisponibilidadProps> = ({ value, onChange }) => (
  <div className="mb-4 flex items-center">
    <select
      value={value}
      onChange={e => onChange(e.target.value as any)}
      className="border rounded px-2 py-1"
    >
      <option value="Todos">Todos</option>
      <option value="En Servicio">En Servicio</option>
      <option value="Fuera de Servicio">Fuera de Servicio</option>
    </select>
  </div>
);

export default FilterDisponibilidad;
