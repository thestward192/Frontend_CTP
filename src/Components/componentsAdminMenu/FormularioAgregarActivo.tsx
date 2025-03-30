import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
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
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Omit<Activo, 'id'>>();
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

  // Configurar modoAdquisicion y precio (si es Donación = 0)
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
    setValue("moneda", nuevaMoneda);
  };

  // Guarda la URL de la foto en el campo 'foto'
  const onUpload = (url: string) => {
    setValue('foto', url);
  };

  const onSubmitHandler: SubmitHandler<Omit<Activo, 'id'>> = async (data) => {
    // Si ya se está enviando, evitar múltiples envíos
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      console.log('Datos enviados al servidor:', data);
      await handleCreateActivo(data);
      setSuccessMessage('Activo creado exitosamente');
      // Una vez enviado, no se re-activa isSubmitting para evitar envíos adicionales
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

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl font-['DM Sans']">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">Agregar Activo</h2>
        {/* Contenedor interno con scroll para formularios extensos */}
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
                  {...register('nombre', { required: 'El campo Nombre es obligatorio' })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${errors.nombre ? 'border-red-500' : ''}`}
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
                  {...register('marca', { required: 'Este campo es obligatorio' })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${errors.marca ? 'border-red-500' : ''}`}
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
                  {...register('modelo', { required: 'Este campo es obligatorio' })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${errors.modelo ? 'border-red-500' : ''}`}
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
                  {...register('serie', { required: 'Este campo es obligatorio' })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${errors.serie ? 'border-red-500' : ''}`}
                />
                {errors.serie && <span className="text-red-600 text-xs">{errors.serie.message}</span>}
              </div>

              {/* Precio (solo se muestra si no es Donación) */}
              {modoAdquisicion !== 'Donación' && (
                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Precio ({moneda === Moneda.COLON ? "₡" : "$"})
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    {...register('precio', { valueAsNumber: true })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleButtonMonedaSwitch}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 opacity-75 hover:opacity-100"
                  >
                    {moneda === Moneda.COLON ? "CRC" : "USD"}
                  </button>
                </div>
              )}

              {/* Descripción (no obligatoria) */}
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

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ubicación <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('ubicacionId', { required: 'Este campo es obligatorio' })}
                  className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${errors.ubicacionId ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccione una Ubicación</option>
                  {ubicaciones.map((ubicacion) => (
                    <option key={ubicacion.id} value={ubicacion.id}>
                      {ubicacion.nombre}
                    </option>
                  ))}
                </select>
                {errors.ubicacionId && (
                  <span className="text-red-600 text-xs">{errors.ubicacionId.message}</span>
                )}
              </div>

              {/* Licitación (solo si es "Ley") */}
              {modoAdquisicion === 'Ley' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Licitación <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('licitacionId', { required: 'Este campo es obligatorio' })}
                    className={`mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 ${errors.licitacionId ? 'border-red-500' : ''}`}
                  >
                    <option value="">Seleccione una Licitación</option>
                    {licitaciones.map((licitacion) => (
                      <option key={licitacion.id} value={licitacion.id}>
                        {licitacion.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.licitacionId && (
                    <span className="text-red-600 text-xs">{errors.licitacionId.message}</span>
                  )}
                </div>
              )}

              {/* Observaciones (no obligatoria) */}
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
                type="submit"
                disabled={loading || isSubmitting}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading || isSubmitting ? 'Guardando...' : 'Crear Activo'}
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
