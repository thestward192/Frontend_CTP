import React, { useState } from 'react';
import { Licencia } from '../../types/licencia';
import { useLicencias } from '../../hooks/useLicencia';
import { useLeyes } from '../../hooks/useLey';

interface FormularioLicenciaProps {
  onClose: () => void;
}

const FormularioLicencia: React.FC<FormularioLicenciaProps> = ({ onClose }) => {
  const { addLicencia } = useLicencias();
  const { leyes, loading: loadingLeyes, error: errorLeyes } = useLeyes();
  const [formData, setFormData] = useState<Omit<Licencia, 'id'>>({
    nombre: '',
    descripcion: '',
    codigoLicencia: '',
    modoAdquisicion: 'Ley', // Por defecto
    ley: undefined, // Inicialmente undefined
  });
  const [showLeyError, setShowLeyError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'modoAdquisicion' && value === 'Donación') {
      setShowLeyError(false); // Resetear el mensaje de error si se cambia el modo de adquisición
      setFormData((prev) => ({
        ...prev,
        ley: undefined,
      }));
    }
  };

  const handleSelectLeyClick = () => {
    if (formData.modoAdquisicion === 'Donación') {
      setShowLeyError(true);
    }
  };

  const handleSelectLeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (formData.modoAdquisicion !== 'Donación') {
      const leySeleccionada = leyes.find(ley => ley.id === parseInt(e.target.value));
      setFormData((prev) => ({
        ...prev,
        ley: leySeleccionada,
      }));
      setShowLeyError(false); // Ocultar mensaje de error si se selecciona una ley correctamente
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLicencia(formData);
      onClose(); // Cerrar el modal al guardar
    } catch (error) {
      console.error('Error al agregar la licencia', error);
    }
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

          <div className="mb-4">
            <label className="block mb-1">Ley</label>
            <select
              name="leyId"
              value={formData.ley?.id || ''}
              onChange={handleSelectLeyChange}
              onClick={handleSelectLeyClick}
              className="w-full border p-2 rounded-md"
              disabled={formData.modoAdquisicion === 'Donación' || loadingLeyes || errorLeyes !== null}
            >
              <option value="" disabled>
                {loadingLeyes ? 'Cargando leyes...' : 'Seleccione una ley'}
              </option>
              {leyes.map((ley) => (
                <option key={ley.id} value={ley.id}>
                  {ley.nombre}
                </option>
              ))}
            </select>
            {showLeyError && (
              <p className="text-red-500 text-sm mt-1">No se puede seleccionar una ley si el modo de adquisición es "Donación".</p>
            )}
            {errorLeyes && <p className="text-red-500 text-sm mt-1">Error al cargar las leyes.</p>}
          </div>

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
