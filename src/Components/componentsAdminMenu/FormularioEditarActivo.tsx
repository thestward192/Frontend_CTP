import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { Activo } from '../../types/activo';
import { Moneda } from '../../types/moneda';
import { useUbicacion } from '../../hooks/useUbicacion';
import { useLicitaciones } from '../../hooks/useLicitacion';
import ImageUploader from './ImageUploader';
import { FaCheckCircle } from 'react-icons/fa';

interface FormularioEditarActivoProps {
  asset: Activo;
  onClose: () => void;
  onSave: (updatedData: Partial<Activo>) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const FormularioEditarActivo: React.FC<FormularioEditarActivoProps> = ({
  asset,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<Omit<Activo, 'id' | 'numPlaca'>>({
    defaultValues: {
      nombre: asset.nombre,
      descripcion: asset.descripcion,
      marca: asset.marca,
      serie: asset.serie,
      estado: asset.estado,
      disponibilidad: asset.disponibilidad,
      modelo: asset.modelo,
      foto: asset.foto,
      precio: asset.precio ?? undefined,
      observacion: asset.observacion,
      ubicacionId: asset.ubicacion ? asset.ubicacion.id.toString() : '',
      modoAdquisicion: asset.modoAdquisicion || 'Donación',
      licitacionId: asset.licitacion ? asset.licitacion.id.toString() : '',
      moneda: asset.moneda || Moneda.COLON,
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    ubicaciones,
    loading: ubicacionesLoading,
    error: ubicacionesError,
  } = useUbicacion('En Servicio');
  const {
    licitaciones,
    loading: licitacionesLoading,
    error: licitacionesError,
  } = useLicitaciones('En Servicio');

  // Determinar modoAdquisicion inicial según asset.licitacion
  useEffect(() => {
    if (asset.licitacion && asset.licitacion.id) {
      setValue('modoAdquisicion', 'Ley');
    } else {
      setValue('modoAdquisicion', 'Donación');
    }
  }, [asset.licitacion, setValue]);

  // Opciones para react-select (value como string)
  const ubicacionOptions: OptionType[] = (ubicaciones || []).map(
    (ubicacion) => ({
      value: ubicacion.id.toString(),
      label: ubicacion.nombre,
    })
  );

  const licitacionOptions: OptionType[] = (licitaciones || []).map(
    (licitacion) => ({
      value: licitacion.id.toString(),
      label: licitacion.nombre,
    })
  );

  // Leer la moneda actual del formulario
  const monedaValor = watch('moneda');

  // Leer el modo de adquisición actual
  const modoAdq = watch('modoAdquisicion');

  // Función para cambiar el símbolo de la moneda
  const handleMonedaSwitch = () => {
    setValue(
      'moneda',
      monedaValor === Moneda.COLON ? Moneda.DOLAR : Moneda.COLON
    );
  };

  // Determinar texto dinámico para el encabezado
  const obtenerTitulo = () => {
    if (modoAdq === 'Ley') {
      return 'Editar Activo Por Ley';
    } else if (modoAdq === 'Donación') {
      return 'Editar Activo Por Donación';
    } else {
      return 'Editar Activo';
    }
  };

  const onSubmitHandler: SubmitHandler<Omit<Activo, 'id' | 'numPlaca'>> =
    async (data) => {
      try {
        onSave(data);
        setSuccessMessage('Activo actualizado exitosamente');
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
          reset(); // limpia el formulario
        }, 1000);
      } catch (error) {
        console.error('Error al actualizar el activo:', error);
      }
    };

  if (ubicacionesLoading || licitacionesLoading) {
    return <p>Cargando ubicaciones y licitaciones...</p>;
  }
  if (ubicacionesError || licitacionesError) {
    return <p>Error al cargar los datos.</p>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl font-['DM Sans']">
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}

        {/* Encabezado dinámico */}
        <h2 className="text-xl font-bold mb-4">{obtenerTitulo()}</h2>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingrese nombre"
                  {...register('nombre', {
                    required: 'El campo Nombre es obligatorio',
                    maxLength: {
                      value: 100,
                      message: 'El nombre no debe superar 100 caracteres',
                    },
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
                  Marca <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingrese marca"
                  {...register('marca', {
                    required: 'El campo Marca es obligatorio',
                    maxLength: {
                      value: 50,
                      message: 'La marca no debe superar 50 caracteres',
                    },
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

              {/* Modelo (ahora opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Modelo
                  {/* Se quitó el asterisco rojo y la validación required */}
                </label>
                <input
                  type="text"
                  placeholder="Ingrese modelo"
                  {...register('modelo', {
                    maxLength: {
                      value: 50,
                      message: 'El modelo no debe superar 50 caracteres',
                    },
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

              {/* Serie (ahora opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serie
                  {/* Se quitó el asterisco rojo y la validación required */}
                </label>
                <input
                  type="text"
                  placeholder="Ingrese serie"
                  {...register('serie', {
                    maxLength: {
                      value: 50,
                      message: 'La serie no debe superar 50 caracteres',
                    },
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

              {/* Precio + Moneda (solo si modoAdquisicion no es "Donación") */}
              {modoAdq !== 'Donación' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio ({monedaValor === Moneda.COLON ? '₡' : '$'})
                    {/* Ahora precio no es obligatorio */}
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        step={0.01}
                        placeholder="Ingrese precio"
                        {...register('precio', {
                          valueAsNumber: true,
                          validate: (value) =>
                            value == null ||
                            value >= 0 ||
                            'No se permiten números negativos',
                        })}
                        className={`w-full border border-gray-300 p-2 rounded-lg ${
                          errors.precio ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.precio && (
                        <span className="text-red-600 text-xs">
                          {errors.precio.message}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleMonedaSwitch}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 opacity-75 hover:opacity-100"
                    >
                      {monedaValor === Moneda.COLON ? 'CRC' : 'USD'}
                    </button>
                  </div>
                </div>
              )}

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('estado', {
                    required: 'El campo Estado es obligatorio',
                  })}
                  className={`mt-2 block w-full border border-gray-300 p-2 rounded-md ${
                    errors.estado ? 'border-red-500' : ''
                  }`}
                >
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="Malo">Malo</option>
                </select>
                {errors.estado && (
                  <span className="text-red-600 text-xs">
                    {errors.estado.message}
                  </span>
                )}
              </div>

              {/* Disponibilidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disponibilidad
                </label>
                <select
                  {...register('disponibilidad')}
                  className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="En Servicio">En Servicio</option>
                  <option value="Dado de Baja">Dado de Baja</option>
                </select>
              </div>

              {/* Descripción (col-span-2) */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  placeholder="Ingrese descripción"
                  {...register('descripcion')}
                  className="mt-2 block w-full border border-gray-300 p-2 rounded-md shadow-sm"
                />
                {errors.descripcion && (
                  <span className="text-red-600 text-xs">
                    {errors.descripcion.message}
                  </span>
                )}
              </div>

              {/* Ubicación con react-select */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ubicación <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="ubicacionId"
                  rules={{ required: 'El campo Ubicación es obligatorio' }}
                  render={({ field }) => {
                    const selectedOption =
                      ubicacionOptions.find(
                        (option) => option.value === field.value
                      ) || null;
                    return (
                      <Select
                        {...field}
                        options={ubicacionOptions}
                        value={selectedOption}
                        onChange={(option: SingleValue<OptionType>) =>
                          field.onChange(option ? option.value : '')
                        }
                        placeholder="Seleccione una Ubicación"
                        classNamePrefix="react-select"
                      />
                    );
                  }}
                />
                {errors.ubicacionId && (
                  <span className="text-red-600 text-xs">
                    {errors.ubicacionId.message}
                  </span>
                )}
              </div>

              {/* Licitación (solo si modoAdquisicion es "Ley") */}
              {modoAdq === 'Ley' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Licitación <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="licitacionId"
                    rules={{ required: 'El campo Licitación es obligatorio' }}
                    render={({ field }) => {
                      const selectedOption =
                        licitacionOptions.find(
                          (option) => option.value === field.value
                        ) || null;
                      return (
                        <Select
                          {...field}
                          options={licitacionOptions}
                          value={selectedOption}
                          onChange={(option: SingleValue<OptionType>) =>
                            field.onChange(option ? option.value : '')
                          }
                          placeholder="Seleccione una Licitación"
                          classNamePrefix="react-select"
                        />
                      );
                    }}
                  />
                  {errors.licitacionId && (
                    <span className="text-red-600 text-xs">
                      {errors.licitacionId.message}
                    </span>
                  )}
                </div>
              )}

              {/* Observaciones (col-span-2) */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Observaciones
                </label>
                <textarea
                  placeholder="Ingrese observaciones"
                  {...register('observacion')}
                  className="mt-2 block w-full border border-gray-300 p-2 rounded-md shadow-sm"
                />
              </div>

              {/* Imagen (col-span-2) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Imagen
                </label>
                {asset.foto ? (
                  <img
                    src={asset.foto}
                    alt="Activo"
                    className="w-32 h-32 object-cover mt-2 rounded border"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 mt-2 rounded flex items-center justify-center text-gray-500">
                    Sin imagen
                  </div>
                )}
                <ImageUploader onUpload={(url) => setValue('foto', url)} />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end space-x-4 mt-4">
              <button
                type="submit"
                onClick={handleSubmit(onSubmitHandler)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioEditarActivo;
