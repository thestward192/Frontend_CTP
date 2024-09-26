import React, { useState } from 'react';

import { useLeyes } from '../../hooks/useLey';
import { CreateLicenciaDTO } from '../../types/licencia';

interface FormularioLicenciaProps {
  onClose: () => void;
  onSave: (licencia: CreateLicenciaDTO) => Promise<void>;
}

const FormularioLicencia: React.FC<FormularioLicenciaProps> = ({ onClose, onSave }) => {
  const { leyes, loading: loadingLeyes, error: errorLeyes } = useLeyes();
  const [formData, setFormData] = useState<CreateLicenciaDTO>({
    nombre: '',
    descripcion: '',
    codigoLicencia: '',
    modoAdquisicion: 'Ley',
    leyId: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'leyId' ? Number(value) : value, // Asegúrate de que leyId sea un número
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData); // Llama a la función onSave pasada como prop
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Agregar Licencia</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre de la Licencia</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Licencia"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="Descripción"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Código de la Licencia</label>
            <input
              type="text"
              name="codigoLicencia"
              value={formData.codigoLicencia}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="Código de la Licencia"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Modo de Adquisición</label>
            <select
              name="modoAdquisicion"
              value={formData.modoAdquisicion}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            >
              <option value="Ley">Ley</option>
              <option value="Donación">Donación</option>
            </select>
          </div>

          {/* Selector de Leyes, si el modo de adquisición es Ley */}
          {formData.modoAdquisicion === 'Ley' && (
            <div className="mb-4">
              <label className="block mb-1">Ley</label>
              <select
                name="leyId"
                value={formData.leyId || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
                disabled={loadingLeyes || errorLeyes !== null}
              >
                <option value="" disabled>
                  {loadingLeyes ? 'Cargando leyes...' : 'Seleccione una ley'}
                </option>
                {leyes?.map((ley) => (
                  <option key={ley.id} value={ley.id.toString()}>
                    {ley.nombre}
                  </option>
                ))}
              </select>
              {errorLeyes && <p className="text-red-500 text-sm mt-1">Error al cargar las leyes.</p>}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioLicencia;
