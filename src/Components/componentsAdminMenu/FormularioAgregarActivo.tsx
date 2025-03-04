import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { Activo } from '../../types/activo';
import { Licitacion } from '../../types/licitacion';
import { Ubicacion } from '../../types/ubicacion';
import { Moneda } from '../../types/moneda';  // <--- Importamos el enum de moneda
import { getUbicaciones } from '../../Services/ubicacionService';
import { getLicitaciones } from '../../Services/licitacionService';
import { useActivos } from '../../hooks/useActivo';
import ImageUploader from './ImageUploader';

interface FormularioAgregarActivoProps {
  onClose: () => void;
  modoAdquisicion: string;
}

const FormularioAgregarActivo: React.FC<FormularioAgregarActivoProps> = ({
  onClose,
  modoAdquisicion,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Omit<Activo, 'id'>>();

  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [moneda, setMoneda] = useState<Moneda>(Moneda.COLON); // Estado para la moneda
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { handleCreateActivo, loading } = useActivos();

  // Cargar ubicaciones y licitaciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ubicacionesData, licitacionesData] = await Promise.all([
          getUbicaciones(),
          getLicitaciones(),
        ]);
        setUbicaciones(ubicacionesData);
        setLicitaciones(licitacionesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  // Configurar modoAdquisicion y precio (si es Donación = 0)
  useEffect(() => {
    if (modoAdquisicion === 'Donación') {
      setValue('precio', 0);
    }
    setValue('modoAdquisicion', modoAdquisicion);
    // Establecemos la moneda inicial en el formulario
    setValue('moneda', moneda);
  }, [modoAdquisicion, moneda, setValue]);

  // Función para alternar la moneda
  const handleButtonMonedaSwitch = () => {
    const nuevaMoneda = moneda === Moneda.COLON ? Moneda.DOLAR : Moneda.COLON;
    setMoneda(nuevaMoneda);
    setValue('moneda', nuevaMoneda); // Actualizamos en el formulario
  };

  // Subir imagen y guardar URL
  const onUpload = (url: string) => {
    setValue('foto', url);
  };

  // Enviar datos
  const onSubmit = async (data: Omit<Activo, 'id'>) => {
    try {
      console.log('Datos enviados al servidor:', data);
      await handleCreateActivo(data);
      setSuccessMessage('Activo creado exitosamente');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        reset();
      }, 1000);
    } catch (error) {
      console.error('Error al crear el activo:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Agregar Activo</h2>
        {/* Contenedor interno con scroll para formularios extensos */}
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ingrese nombre"
                  {...register('nombre', {
                    required: 'El campo Nombre es obligatorio',
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.nombre ? 'border-red-500' : ''
                  }`}
                />
                {errors.nombre && (
                  <span className="text-red-600 text-xs">
                    {errors.nombre.message}
                  </span>
                )}
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marca
                </label>
                <input
                  type="text"
                  placeholder="Ingrese marca"
                  {...register('marca', {
                    required: 'Este campo es obligatorio',
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.marca ? 'border-red-500' : ''
                  }`}
                />
                {errors.marca && (
                  <span className="text-red-600 text-xs">
                    {errors.marca.message}
                  </span>
                )}
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Modelo
                </label>
                <input
                  type="text"
                  placeholder="Ingrese modelo"
                  {...register('modelo', {
                    required: 'Este campo es obligatorio',
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.modelo ? 'border-red-500' : ''
                  }`}
                />
                {errors.modelo && (
                  <span className="text-red-600 text-xs">
                    {errors.modelo.message}
                  </span>
                )}
              </div>

              {/* Serie */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serie
                </label>
                <input
                  type="text"
                  placeholder="Ingrese serie"
                  {...register('serie', {
                    required: 'Este campo es obligatorio',
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.serie ? 'border-red-500' : ''
                  }`}
                />
                {errors.serie && (
                  <span className="text-red-600 text-xs">
                    {errors.serie.message}
                  </span>
                )}
              </div>

              {/* Precio + moneda (solo se muestra si no es Donación) */}
              {modoAdquisicion !== 'Donación' && (
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio ({moneda === Moneda.COLON ? '₡' : '$'})
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step={0.01}
                      placeholder="Ingrese precio"
                      {...register('precio', { valueAsNumber: true })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      onClick={handleButtonMonedaSwitch}
                    >
                      {moneda === Moneda.COLON ? '₡' : '$'}
                    </button>
                  </div>
                </div>
              )}

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  placeholder="Ingrese descripción"
                  {...register('descripcion')}
                  className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              {/* Ubicación (sin opción por defecto seleccionada) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <select
                  {...register('ubicacionId', {
                    required: 'Este campo es obligatorio',
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.ubicacionId ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Seleccione una Ubicación</option>
                  {ubicaciones.map((ubicacion) => (
                    <option key={ubicacion.id} value={ubicacion.id}>
                      {ubicacion.nombre}
                    </option>
                  ))}
                </select>
                {errors.ubicacionId && (
                  <span className="text-red-600 text-xs">
                    {errors.ubicacionId.message}
                  </span>
                )}
              </div>

              {/* Licitación (solo si es "Ley", sin opción por defecto) */}
              {modoAdquisicion === 'Ley' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Licitación
                  </label>
                  <select
                    {...register('licitacionId', {
                      required: 'Este campo es obligatorio',
                    })}
                    className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                      errors.licitacionId ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Seleccione una Licitación</option>
                    {licitaciones.map((licitacion) => (
                      <option key={licitacion.id} value={licitacion.id}>
                        {licitacion.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.licitacionId && (
                    <span className="text-red-600 text-xs">
                      {errors.licitacionId.message}
                    </span>
                  )}
                </div>
              )}

              {/* Observaciones */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Observaciones
                </label>
                <textarea
                  placeholder="Ingrese observaciones"
                  {...register('observacion')}
                  className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              {/* Subida de imagen */}
              <div className="md:col-span-2">
                <ImageUploader onUpload={onUpload} />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Creando...' : 'Crear Activo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioAgregarActivo;
