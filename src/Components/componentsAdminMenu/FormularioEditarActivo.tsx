import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Activo } from '../../types/activo';
import { useUbicacion } from '../../hooks/useUbicacion'; // Usamos el hook de ubicaciones
import { useLeyes } from '../../hooks/useLey';
 // Usamos el hook de leyes

interface FormularioEditarActivoProps {
  asset: Activo;
  onClose: () => void;
  onSave: (updatedData: Partial<Activo>) => void;
}

const FormularioEditarActivo: React.FC<FormularioEditarActivoProps> = ({ asset, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Activo>>({
    nombre: asset.nombre,
    descripcion: asset.descripcion,
    marca: asset.marca,
    serie: asset.serie,
    estado: asset.estado,
    disponibilidad: asset.disponibilidad, // Incluimos la disponibilidad
    modelo: asset.modelo,
    numPlaca: asset.numPlaca,
    foto: asset.foto,
    precio: asset.precio,
    observacion: asset.observacion,
    ubicacionId: asset.ubicacion?.id || 0, // Aseguramos que tenga el ID de la ubicación actual
    modoAdquisicion: asset.modoAdquisicion,
    leyId: asset.ley?.id || '', // Aseguramos que el leyId sea el valor del ID de la ley
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Usamos el hook useUbicacion para obtener las ubicaciones
  const { ubicaciones, loading: ubicacionesLoading, error: ubicacionesError } = useUbicacion();

  // Usamos el hook useLeyes para obtener las leyes
  const { leyes, loading: leyesLoading, error: leyesError } = useLeyes();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSave(formData);
      setSuccessMessage('Activo actualizado exitosamente');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error al actualizar el activo:', error);
    }
  };

  if (ubicacionesLoading || leyesLoading) {
    return <p>Cargando ubicaciones y leyes...</p>;
  }

  if (ubicacionesError || leyesError) {
    return <p>Error al cargar los datos</p>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}

        <h2 className="text-lg font-bold mb-4">Editar Activo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Marca</label>
              <input
                type="text"
                name="marca"
                value={formData.marca || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Serie */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Serie</label>
              <input
                type="text"
                name="serie"
                value={formData.serie || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Número de Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Placa</label>
              <input
                type="number"
                name="numPlaca"
                value={formData.numPlaca || 0}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio || 0}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            {/* Descripción */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <select
                name="ubicacionId"
                value={formData.ubicacionId || 0}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              >
                <option value="">Seleccione una Ubicación</option>
                {ubicaciones.map((ubicacion) => (
                  <option key={ubicacion.id} value={ubicacion.id}>
                    {ubicacion.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Ley (si aplica) */}
            {formData.modoAdquisicion === 'Ley' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ley</label>
                  <select
                    name="leyId"
                    value={formData.leyId || ''} // Preseleccionamos la ley actual
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  >
                    <option value="">Seleccione una Ley</option>
                    {leyes.map((ley) => (
                      <option key={ley.id} value={ley.id}>
                        {ley.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                  <textarea
                    name="observacion"
                    value={formData.observacion || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarActivo;
