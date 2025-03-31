import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { FaCheckCircle } from 'react-icons/fa';
import { Activo } from '../../types/activo';
import { Moneda } from '../../types/moneda';
import { useUbicacion } from '../../hooks/useUbicacion';
import { useLicitaciones } from '../../hooks/useLicitacion';
import ImageUploader from './ImageUploader';

interface FormularioEditarActivoProps {
  asset: Activo;
  onClose: () => void;
  onSave: (updatedData: Partial<Activo>) => void;
}

const FormularioEditarActivo: React.FC<FormularioEditarActivoProps> = ({
  asset,
  onClose,
  onSave,
}) => {
  // Estado local para manejar los campos del activo
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
    // Se asume que si no existe, se guarda 0 (sin selección)
    ubicacionId: asset.ubicacion?.id || 0,
    modoAdquisicion: asset.modoAdquisicion || 'Donación',
    // Para licitación usaremos 0 cuando no haya
    licitacionId: asset.licitacion?.id || 0,
    moneda: asset.moneda || Moneda.COLON,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { ubicaciones, loading: ubicacionesLoading, error: ubicacionesError } = useUbicacion();
  const { licitaciones, loading: licitacionesLoading, error: licitacionesError } = useLicitaciones();

  // Si está "Dado de Baja", forzamos estado "Malo"
  useEffect(() => {
    if (formData.disponibilidad === 'Dado de Baja') {
      setFormData((prevState) => ({
        ...prevState,
        estado: 'Malo',
      }));
    }
  }, [formData.disponibilidad]);

  // Si se selecciona una licitación, asumimos modo 'Ley'; de lo contrario, 'Donación'
  useEffect(() => {
    if (formData.licitacionId && formData.licitacionId !== 0) {
      setFormData((prev) => ({ ...prev, modoAdquisicion: 'Ley' }));
    } else {
      setFormData((prev) => ({ ...prev, modoAdquisicion: 'Donación' }));
    }
  }, [formData.licitacionId]);

  // Cambio de moneda
  const handleMonedaSwitch = () => {
    const nuevaMoneda = formData.moneda === Moneda.COLON ? Moneda.DOLAR : Moneda.COLON;
    setFormData((prevData) => ({
      ...prevData,
      moneda: nuevaMoneda,
    }));
  };

  // Manejo de subida de imagen
  const handleImageUpload = (url: string) => {
    setFormData((prevData) => ({
      ...prevData,
      foto: url,
    }));
  };

  // Maneja los cambios en campos tipo input, textarea o select nativo
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Envía la información actualizada al padre
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

  // Mientras se cargan los datos, mostramos un mensaje
  if (ubicacionesLoading || licitacionesLoading) {
    return <p>Cargando ubicaciones y licitaciones...</p>;
  }
  if (ubicacionesError || licitacionesError) {
    return <p>Error al cargar los datos</p>;
  }

  // Opciones para react‑select (usamos números para value)
  const ubicacionOptions = ubicaciones.map((ubicacion) => ({
    value: ubicacion.id,
    label: ubicacion.nombre,
  }));

  const licitacionOptions = licitaciones.map((licitacion) => ({
    value: licitacion.id,
    label: licitacion.nombre,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Editar Activo</h2>

        {/* Contenedor con scroll si el contenido es extenso */}
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
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
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
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
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
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
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            {/* Precio + Moneda */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio ({formData.moneda === Moneda.COLON ? '₡' : '$'})
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step={0.01}
                  name="precio"
                  value={formData.precio ?? 0}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <button
                  type="button"
                  onClick={handleMonedaSwitch}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  {formData.moneda === Moneda.COLON ? 'CRC' : 'USD'}
                </button>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                name="estado"
                value={formData.estado || 'Bueno'}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
                required
                disabled={formData.disponibilidad === 'Dado de Baja'}
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
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
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
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* Ubicación con react‑select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <Select
                options={ubicacionOptions}
                value={
                  ubicacionOptions.find(
                    (option) => option.value === formData.ubicacionId
                  ) || null
                }
                onChange={(
                  option: SingleValue<{ value: number; label: string }>
                ) =>
                  setFormData({
                    ...formData,
                    ubicacionId: option ? option.value : 0,
                  })
                }
                placeholder="Seleccione una Ubicación"
                classNamePrefix="react-select"
              />
            </div>

            {/* Licitación (solo si modoAdquisicion es 'Ley') */}
            {formData.modoAdquisicion === 'Ley' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Licitación
                </label>
                <Select
                  options={licitacionOptions}
                  value={
                    licitacionOptions.find(
                      (option) => option.value === formData.licitacionId
                    ) || null
                  }
                  onChange={(
                    option: SingleValue<{ value: number; label: string }>
                  ) =>
                    setFormData({
                      ...formData,
                      licitacionId: option ? option.value : 0,
                    })
                  }
                  placeholder="Seleccione una Licitación"
                  classNamePrefix="react-select"
                />
              </div>
            )}

            {/* Observaciones */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                name="observacion"
                value={formData.observacion || ''}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* Imagen: muestra la actual y permite subir otra */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Imagen
              </label>
              {formData.foto ? (
                <img
                  src={formData.foto}
                  alt="Activo"
                  className="w-32 h-32 object-cover mt-2 rounded border"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 mt-2 rounded flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}
              <ImageUploader onUpload={handleImageUpload} />
            </div>
          </form>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioEditarActivo;
