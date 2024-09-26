import React, { useState } from 'react';
import { Licencia } from '../../types/licencia';
import { useLeyes } from '../../hooks/useLey';
import { useLicencias } from '../../hooks/useLicencia';

interface EditLicenciaProps {
  licencia: Licencia;
  onClose: () => void;
}

const EditLicencia: React.FC<EditLicenciaProps> = ({ licencia, onClose }) => {
  const [formData, setFormData] = useState<Licencia>({
    id: licencia.id,
    nombre: licencia.nombre,
    descripcion: licencia.descripcion,
    codigoLicencia: licencia.codigoLicencia,
    modoAdquisicion: licencia.modoAdquisicion,
    leyId: licencia.leyId || undefined,
  });

  const { updateLicencia } = useLicencias();
  const { leyes, loading: leyesLoading, error: leyesError } = useLeyes();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'leyId' ? Number(value) : value, // Asegúrate de que leyId sea un número
    }));

    // Si el modo de adquisición cambia a "Ley", asegúrate de que leyId esté capturado como número
    if (name === 'modoAdquisicion' && value === 'Ley') {
      setFormData((prev) => ({
        ...prev,
        leyId: prev.leyId || undefined, // Captura o asegura que leyId esté definido como number | undefined
      }));
    }
    // Si el modo de adquisición cambia a algo distinto de "Ley", limpiar leyId
    if (name === 'modoAdquisicion' && value !== 'Ley') {
      setFormData((prev) => ({
        ...prev,
        leyId: undefined,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await updateLicencia({ id: formData.id, licencia: formData });
      onClose();
    } catch (error) {
      console.error('Error al actualizar la licencia:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Licencia</h2>
        <form>
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

          {formData.modoAdquisicion === 'Ley' && (
            <div className="mb-4">
              <label className="block mb-1">Ley</label>
              <select
                name="leyId"
                value={formData.leyId?.toString() || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
                disabled={leyesLoading || leyesError !== null}
                required
              >
                <option value="" disabled>
                  {leyesLoading ? 'Cargando leyes...' : 'Seleccione una ley'}
                </option>
                {leyes?.map((ley) => (
                  <option key={ley.id} value={ley.id.toString()}>
                    {ley.nombre}
                  </option>
                ))}
              </select>
              {leyesError && <p className="text-red-500 text-sm mt-1">Error al cargar las leyes.</p>}
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
              type="button"
              onClick={handleSave}
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

export default EditLicencia;
