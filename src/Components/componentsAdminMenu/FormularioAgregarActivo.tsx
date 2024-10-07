import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { Activo } from '../../types/activo';
import { Ley } from '../../types/ley';
import { Ubicacion } from '../../types/ubicacion';
import { getUbicaciones } from '../../Services/ubicacionService';
import { getLeyes } from '../../Services/leyService';
import { useActivos } from '../../hooks/useActivo';

const FormularioAgregarActivo: React.FC<{ onClose: () => void; modoAdquisicion: string }> = ({ onClose, modoAdquisicion }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Activo, 'id'>>(); // Configuramos react-hook-form
  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { handleCreateActivo, loading, error } = useActivos();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ubicacionesData, leyesData] = await Promise.all([getUbicaciones(), getLeyes()]);
        setUbicaciones(ubicacionesData);
        setLeyes(leyesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: Omit<Activo, 'id'>) => {
    try {
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
          {/* Usamos grid para crear 2 columnas */}
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
                type="number"
                {...register('numPlaca', { required: 'Este campo es obligatorio', valueAsNumber: true })}
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.numPlaca ? 'border-red-500' : ''}`}
              />
              {errors.numPlaca && <span className="text-red-600 text-xs">{errors.numPlaca.message}</span>}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                {...register('precio', { valueAsNumber: true })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            {/* Descripción */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                {...register('descripcion', { required: 'Este campo es obligatorio' })}
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.descripcion ? 'border-red-500' : ''}`}
              />
              {errors.descripcion && <span className="text-red-600 text-xs">{errors.descripcion.message}</span>}
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

            {/* Ley (solo si es modo Ley) */}
            {modoAdquisicion === 'Ley' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ley</label>
                  <select
                    {...register('leyId')}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  >
                    <option value="">Seleccione una Ley</option>
                    {leyes.map((ley) => (
                      <option key={ley.id} value={ley.id}>
                        {ley.numLey}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Observaciones */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                  <textarea
                    {...register('observacion')}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}  // Aseguramos que el botón de cancelar cierre el formulario
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
