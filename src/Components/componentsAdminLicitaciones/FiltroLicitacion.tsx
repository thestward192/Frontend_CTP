import { useState } from "react";

interface FiltersProps {
    onFilterChange: (filterName: string, value: string) => void;
  }

const FiltroLicitacion = ({ onFilterChange }: FiltersProps) => {
     const [estado, setEstado] = useState('');

       const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
         const value = e.target.value;
         setEstado(value);
         onFilterChange('disponibilidad', value);
       };

  return (
    <div className="relative w-full sm:w-auto">
        <select
          value={estado}
          onChange={handleEstadoChange}
          className="bg-white w-full sm:w-[160px] h-[35px] p-2 rounded-lg border border-gray-300 shadow-sm text-xs"
        >
          <option value="">Todos</option>
          <option value="En Servicio">En servicio</option>
          <option value="Fuera de Servicio">Fuera de servicio</option>
        </select>
      </div>
  )
}

export default FiltroLicitacion