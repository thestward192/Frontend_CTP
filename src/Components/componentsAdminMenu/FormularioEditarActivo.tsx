import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Activo } from '../../types/activo';
import { useUbicacion } from '../../hooks/useUbicacion'; // Usamos el hook de ubicaciones
import { useLicitaciones } from '../../hooks/useLicitacion'; // Nuevo hook de licitaciones

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
    disponibilidad: asset.disponibilidad,
    modelo: asset.modelo,
    numPlaca: asset.numPlaca,
    foto: asset.foto,
    precio: asset.precio,
    observacion: asset.observacion,
    ubicacionId: asset.ubicacion?.id || 0,
    modoAdquisicion: asset.modoAdquisicion,
    licitacionId: asset.licitacion?.id || '',
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDadoDeBaja = formData.disponibilidad === 'Dado de Baja'; // Verificamos si está "Dado de Baja"

  const { ubicaciones, loading: ubicacionesLoading, error: ubicacionesError } = useUbicacion();
  const { licitaciones, loading: licitacionesLoading, error: licitacionesError } = useLicitaciones();

  useEffect(() => {
    if (formData.licitacionId) {
      setFormData(prevState => ({
        ...prevState,
        modoAdquisicion: 'Ley',
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        modoAdquisicion: 'Donación',
      }));
    }
  }, [formData.licitacionId]);

  useEffect(() => {
    if (formData.disponibilidad === 'Dado de Baja') {
      setFormData(prevState => ({
        ...prevState,
        estado: 'Malo',
      }));
    }
  }, [formData.disponibilidad]);

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

  if (ubicacionesLoading || licitacionesLoading) {
    return <p>Cargando ubicaciones y licitaciones...</p>;
  }

  if (ubicacionesError || licitacionesError) {
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

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                name="estado"
                value={formData.estado || 'Bueno'}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
                disabled={isDadoDeBaja}
              >
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Malo">Malo</option>
              </select>
            </div>

            {/* Disponibilidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Disponibilidad</label>
              <select
                name="disponibilidad"
                value={formData.disponibilidad || 'Activo'}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              >
                <option value="Activo">Activo</option>
                <option value="Dado de Baja">Dado de Baja</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
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

            {/* Licitación */}
            {formData.modoAdquisicion === 'Ley' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Licitación</label>
                <select
                  name="licitacionId"
                  value={formData.licitacionId || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                >
                  <option value="">Seleccione una Licitación</option>
                  {licitaciones.map((licitacion) => (
                    <option key={licitacion.id} value={licitacion.id}>
                      {licitacion.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Observaciones */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Observaciones</label>
              <textarea
                name="observacion"
                value={formData.observacion || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
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
