import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
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

interface OptionType {
  value: number;
  label: string;
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
    reValidateMode: 'onChange',
    defaultValues: {
      nombre: '',
      descripcion: '',
      marca: '',
      serie: '',
      estado: 'Bueno',
      disponibilidad: 'En Servicio',
      modelo: '',
      foto: '',
      precio: undefined,
      observacion: '',
      ubicacionId: undefined,
      modoAdquisicion: modoAdquisicion,
      licitacionId: undefined,
      moneda: Moneda.COLON,
    },
  });

  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [moneda, setMoneda] = useState<Moneda>(Moneda.COLON);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleCreateActivo, loading } = useActivos();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ubicacionesData, licitacionesData] = await Promise.all([
          getUbicaciones('En Servicio'),
          getLicitaciones('En Servicio'),
        ]);
        setUbicaciones(ubicacionesData);
        setLicitaciones(licitacionesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

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

  const ubicacionOptions = ubicaciones.map((ubicacion) => ({
    value: ubicacion.id,
    label: ubicacion.nombre,
  }));

  const licitacionOptions = licitaciones.map((licitacion) => ({
    value: licitacion.id,
    label: licitacion.nombre,
  }));

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[85vw] h-[80vh] flex flex-col font-['DM Sans']">
        {/* Header */}
        <div className="p-4 border-b">
          {successMessage && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-4 flex items-center">
              <FaCheckCircle className="mr-2" />
              {successMessage}
            </div>
          )}
          <h2 className="text-2xl font-bold">Agregar Activo</h2>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto p-4">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="h-full">
            <div className="flex gap-6">
              {/* Left side - Form fields */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="md:col-span-2">
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
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                        errors.nombre ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.nombre && <span className="text-red-600 text-xs">{errors.nombre.message}</span>}
                  </div>

                  {/* Marca y Modelo en la misma fila */}
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
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                        errors.marca ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.marca && <span className="text-red-600 text-xs">{errors.marca.message}</span>}
                  </div>

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
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                        errors.modelo ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.modelo && <span className="text-red-600 text-xs">{errors.modelo.message}</span>}
                  </div>

                  {/* Serie y Ubicación en la misma fila */}
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
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                        errors.serie ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.serie && <span className="text-red-600 text-xs">{errors.serie.message}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ubicación <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="ubicacionId"
                      defaultValue={undefined}
                      rules={{ required: 'El campo Ubicación es obligatorio' }}
                      render={({ field: { onChange, value, ...field } }) => {
                        const selectedOption = value
                          ? ubicacionOptions.find((option) => option.value === Number(value))
                          : null;
                        return (
                          <Select<OptionType>
                            {...field}
                            value={selectedOption}
                            options={ubicacionOptions}
                            onChange={(option) => onChange(option?.value)}
                            placeholder="Seleccione una Ubicación"
                            classNamePrefix="react-select"
                          />
                        );
                      }}
                    />
                    {errors.ubicacionId && (
                      <span className="text-red-600 text-xs">{errors.ubicacionId.message}</span>
                    )}
                  </div>

                  {/* Precio y Licitación (condicional) */}
                  {modoAdquisicion !== 'Donación' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                              return (!isNaN(numberValue) && numberValue > 0) || 'El precio debe ser mayor que cero';
                            },
                          })}
                          className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 ${
                            errors.precio ? 'border-red-500' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleButtonMonedaSwitch}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                          {moneda === Moneda.COLON ? 'CRC' : 'USD'}
                        </button>
                      </div>
                      {errors.precio && <p className="text-red-600 text-xs mt-1">{errors.precio.message}</p>}
                    </div>
                  )}

                  {modoAdquisicion === 'Ley' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Licitación <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="licitacionId"
                        defaultValue={undefined}
                        rules={{ required: 'El campo Licitación es obligatorio' }}
                        render={({ field: { onChange, value, ...field } }) => {
                          const selectedOption = value
                            ? licitacionOptions.find((option) => option.value === Number(value))
                            : null;
                          return (
                            <Select<OptionType>
                              {...field}
                              value={selectedOption}
                              options={licitacionOptions}
                              onChange={(option) => onChange(option?.value)}
                              placeholder="Seleccione una Licitación"
                              classNamePrefix="react-select"
                            />
                          );
                        }}
                      />
                      {errors.licitacionId && (
                        <span className="text-red-600 text-xs">{errors.licitacionId.message}</span>
                      )}
                    </div>
                  )}                  {/* Descripción y Observaciones en la misma fila */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      placeholder="Ingrese descripción"
                      {...register('descripcion')}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none"
                    />
                    {errors.descripcion && <span className="text-red-600 text-xs">{errors.descripcion.message}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                    <textarea
                      placeholder="Ingrese observaciones"
                      {...register('observacion')}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none"
                    />
                    {errors.observacion && (
                      <span className="text-red-600 text-xs">{errors.observacion.message}</span>
                    )}
                  </div>
                </div>
              </div>              {/* Right side - Image uploader */}
              <div className="w-96 flex-shrink-0 flex flex-col justify-start">
                <ImageUploader onUpload={(url) => setValue('foto', url)} />
              </div>
            </div>
          </form>
        </div>        {/* Footer with buttons */}
        <div className="border-t p-4 flex justify-end space-x-4">
          <button
            type="submit"
            onClick={handleSubmit(onSubmitHandler)}
            disabled={loading || isSubmitting}
            className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading || isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioAgregarActivo;
