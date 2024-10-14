import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { Activo } from '../../types/activo';
import { Licitacion } from '../../types/licitacion';
import { Ubicacion } from '../../types/ubicacion';
import { getUbicaciones } from '../../Services/ubicacionService';
import { getLicitaciones } from '../../Services/licitacionService';
import { useActivos } from '../../hooks/useActivo';

const FormularioAgregarActivo: React.FC<{ onClose: () => void; modoAdquisicion: string }> = ({ onClose, modoAdquisicion }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Omit<Activo, 'id'>>();
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { handleCreateActivo, loading } = useActivos();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ubicacionesData, licitacionesData] = await Promise.all([getUbicaciones(), getLicitaciones()]);
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
      setValue('precio', 0); // Establecemos el precio a 0 si es Donación
    }
    setValue('modoAdquisicion', modoAdquisicion); // Actualizamos el modoAdquisicion según lo seleccionado
  }, [modoAdquisicion, setValue]);

  const onSubmit = async (data: Omit<Activo, 'id'>) => {
    try {
      console.log('Datos enviados al servidor:', data); // Verificar los datos antes de enviarlos al servidor
      await handleCreateActivo(data); // Enviamos los datos al servidor

      setSuccessMessage('Activo creado exitosamente');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        reset();  // Reseteamos el formulario
      }, 1000);
    } catch (error) {
      console.error('Error al crear el activo:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}

        <h2 className="text-lg font-bold mb-4">Agregar Activo</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                {...register('nombre', { required: 'El campo Nombre es obligatorio' })}
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.nombre ? 'border-red-500' : ''}`}
              />
              {errors.nombre && <span className="text-red-600 text-xs">{errors.nombre.message}</span>}
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Marca</label>
              <input
                type="text"
                {...register('marca', { required: 'Este campo es obligatorio' })}
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.marca ? 'border-red-500' : ''}`}
              />
              {errors.marca && <span className="text-red-600 text-xs">{errors.marca.message}</span>}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <input
                type="text"
                {...register('modelo', { required: 'Este campo es obligatorio' })}
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.modelo ? 'border-red-500' : ''}`}
              />
              {errors.modelo && <span className="text-red-600 text-xs">{errors.modelo.message}</span>}
            </div>

            {/* Serie */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Serie</label>
              <input
                type="text"
                {...register('serie', { required: 'Este campo es obligatorio' })}
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.serie ? 'border-red-500' : ''}`}
              />
              {errors.serie && <span className="text-red-600 text-xs">{errors.serie.message}</span>}
            </div>

            {/* Número de Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Placa</label>
              <input
                type="text"
                {...register('numPlaca', {
                  required: 'Este campo es obligatorio',
                  pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: 'El número de placa debe tener el formato ####-####',
                  },
                })}
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.numPlaca ? 'border-red-500' : ''}`}
              />
              {errors.numPlaca && <span className="text-red-600 text-xs">{errors.numPlaca.message}</span>}
            </div>

            {/* Precio (Solo se muestra si NO es Donación) */}
            {modoAdquisicion !== 'Donación' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="number"
                  {...register('precio', { valueAsNumber: true })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
            )}

            {/* Descripción (No obligatoria) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                {...register('descripcion')}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <select
                {...register('ubicacionId', { required: 'Este campo es obligatorio' })}
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.ubicacionId ? 'border-red-500' : ''}`}
              >
                <option value="">Seleccione una Ubicación</option>
                {ubicaciones.map((ubicacion) => (
                  <option key={ubicacion.id} value={ubicacion.id}>
                    {ubicacion.nombre}
                  </option>
                ))}
              </select>
              {errors.ubicacionId && <span className="text-red-600 text-xs">{errors.ubicacionId.message}</span>}
            </div>

            {/* Licitación (solo si es modo Ley) */}
            {modoAdquisicion === 'Ley' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Licitación</label>
                <select
                  {...register('licitacionId', { required: 'Este campo es obligatorio' })}
                  className={`w-full border border-gray-300 p-2 rounded-lg ${errors.licitacionId ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccione una Licitación</option>
                  {licitaciones.map((licitacion) => (
                    <option key={licitacion.id} value={licitacion.id}>
                      {licitacion.nombre}
                    </option>
                  ))}
                </select>
                {errors.licitacionId && <span className="text-red-600 text-xs">{errors.licitacionId.message}</span>}
              </div>
            )}

            {/* Observaciones (Disponible tanto para Ley como Donación) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Observaciones</label>
              <textarea
                {...register('observacion')}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
          </div>

          {/* Botones */}
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
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Activo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioAgregarActivo;
