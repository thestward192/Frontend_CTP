import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { Activo } from '../../types/activo';
import { Licitacion } from '../../types/licitacion';
import { Ubicacion } from '../../types/ubicacion';
import { Moneda } from '../../types/moneda';
import { getUbicaciones } from '../../Services/ubicacionService';
import { getLicitaciones } from '../../Services/licitacionService';
import { useActivos } from '../../hooks/useActivo';
import ImageUploader from './ImageUploader';
import { FaCheckCircle } from 'react-icons/fa';

interface FormularioAgregarActivoProps {
  onClose: () => void;
  modoAdquisicion: string;
}

const FormularioAgregarActivo: React.FC<FormularioAgregarActivoProps> = ({ onClose, modoAdquisicion }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Omit<Activo, 'id' | 'numPlaca'>>({
    // CAMBIO: Se utiliza reValidateMode: 'onChange' para revalidar al modificar el input.
    reValidateMode: 'onChange',
    defaultValues: {
      nombre: '',
      descripcion: '',
      marca: '',
      serie: '',
      estado: 'Bueno',
      disponibilidad: 'Activo',
      modelo: '',
      foto: '',
      precio: undefined,
      observacion: '',
      ubicacionId: '',
      modoAdquisicion: modoAdquisicion,
      licitacionId: '',
      moneda: Moneda.COLON,
    },
  });
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [moneda, setMoneda] = useState<Moneda>(Moneda.COLON);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Configurar modoAdquisicion y si es Donación, setear precio en 0; también actualizar moneda
  useEffect(() => {
    if (modoAdquisicion === 'Donación') {
      setValue('precio', 0);
    }
    setValue('modoAdquisicion', modoAdquisicion);
    setValue('moneda', moneda);
  }, [modoAdquisicion, moneda, setValue]);

  const handleButtonMonedaSwitch = () => {
    const nuevaMoneda = moneda === Moneda.COLON ? Moneda.DOLAR : Moneda.COLON;
    setMoneda(nuevaMoneda);
    setValue('moneda', nuevaMoneda);
  };

  // Función para subir imagen y asignar la URL al campo 'foto'
  const onUpload = (url: string) => {
    setValue('foto', url);
  };

  const onSubmitHandler: SubmitHandler<Omit<Activo, 'id' | 'numPlaca'>> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  // Opciones para react‑select (convirtiendo id a string)
  const ubicacionOptions = ubicaciones.map((ubicacion) => ({
    value: ubicacion.id.toString(),
    label: ubicacion.nombre,
  }));

  const licitacionOptions = licitaciones.map((licitacion) => ({
    value: licitacion.id.toString(),
    label: licitacion.nombre,
  }));

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* CAMBIO: El contenedor principal se hace más ancho con max-w-4xl */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl font-['DM Sans']">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">Agregar Activo</h2>
        {/* CAMBIO: Se agrega contenedor con scroll interno */}
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    maxLength: { value: 100, message: 'El nombre no debe superar 100 caracteres' },
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.nombre ? 'border-red-500' : ''
                  }`}
                />
                {errors.nombre && <span className="text-red-600 text-xs">{errors.nombre.message}</span>}
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
                    maxLength: { value: 50, message: 'La marca no debe superar 50 caracteres' },
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.marca ? 'border-red-500' : ''
                  }`}
                />
                {errors.marca && <span className="text-red-600 text-xs">{errors.marca.message}</span>}
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingrese modelo"
                  {...register('modelo', {
                    required: 'El campo Modelo es obligatorio',
                    maxLength: { value: 50, message: 'El modelo no debe superar 50 caracteres' },
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.modelo ? 'border-red-500' : ''
                  }`}
                />
                {errors.modelo && <span className="text-red-600 text-xs">{errors.modelo.message}</span>}
              </div>

              {/* Serie */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingrese serie"
                  {...register('serie', {
                    required: 'El campo Serie es obligatorio',
                    maxLength: { value: 50, message: 'La serie no debe superar 50 caracteres' },
                  })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                    errors.serie ? 'border-red-500' : ''
                  }`}
                />
                {errors.serie && <span className="text-red-600 text-xs">{errors.serie.message}</span>}
              </div>

              {/* Precio + Moneda (solo si modoAdquisicion no es "Donación") */}
              {modoAdquisicion !== 'Donación' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio ({moneda === Moneda.COLON ? '₡' : '$'})
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step={0.01}
                      min="0"
                      {...register('precio', {
                        valueAsNumber: true,
                        validate: (value) => {
                          const numberValue = Number(value);
                          return (!isNaN(numberValue) && numberValue >= 0) || 'No se permiten montos negativos';
                        },
                      })}
                      className={`w-full border border-gray-300 p-2 rounded-lg ${
                        errors.precio ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleButtonMonedaSwitch}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 opacity-75 hover:opacity-100"
                    >
                      {moneda === Moneda.COLON ? 'CRC' : 'USD'}
                    </button>
                  </div>
                  {errors.precio && <p className="text-red-600 text-xs mt-1">{errors.precio.message}</p>}
                </div>
              )}

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  placeholder="Ingrese descripción"
                  {...register('descripcion')}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.descripcion && <span className="text-red-600 text-xs">{errors.descripcion.message}</span>}
              </div>

              {/* Ubicación con react-select */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ubicación <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="ubicacionId"
                  defaultValue=""
                  rules={{ required: 'El campo Ubicación es obligatorio' }}
                  render={({ field }) => {
                    const selectedOption = ubicacionOptions.find((option) => option.value === field.value) || null;
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
                {errors.ubicacionId && <span className="text-red-600 text-xs">{errors.ubicacionId.message}</span>}
              </div>

              {/* Licitación con react-select (solo si modoAdquisicion es "Ley") */}
              {modoAdquisicion === 'Ley' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Licitación <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="licitacionId"
                    defaultValue=""
                    rules={{ required: 'El campo Licitación es obligatorio' }}
                    render={({ field }) => {
                      const selectedOption = licitacionOptions.find((option) => option.value === field.value) || null;
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
                  {errors.licitacionId && <span className="text-red-600 text-xs">{errors.licitacionId.message}</span>}
                </div>
              )}

              {/* Observaciones */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea
                  placeholder="Ingrese observaciones"
                  {...register('observacion')}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.observacion && <span className="text-red-600 text-xs">{errors.observacion.message}</span>}
              </div>

              {/* Subida de imagen */}
              <div className="md:col-span-2">
                <ImageUploader onUpload={(url) => setValue('foto', url)} />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end space-x-4 mt-4">
              <button
                type="submit"
                onClick={handleSubmit(onSubmitHandler)}
                disabled={loading || isSubmitting}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading || isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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

export default FormularioAgregarActivo;
