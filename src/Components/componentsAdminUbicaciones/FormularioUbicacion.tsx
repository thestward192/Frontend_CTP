import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUbicacion } from '../../hooks/useUbicacion';

interface FormularioUbicacionProps {
  onClose: () => void;
  onUbicacionCreated: () => void;
}

interface FormData {
  nombre: string;
  descripcion: string;
  pabellon: string;
}

const FormularioUbicacion: React.FC<FormularioUbicacionProps> = ({ onClose, onUbicacionCreated  }) => {
  const { handleSubmitUbicacion, isLoading, isError } = useUbicacion();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    handleSubmitUbicacion(data, {
      onSuccess: () => {
        onUbicacionCreated();
        onClose(); // Cerrar el formulario inmediatamente al crear una ubicación
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] relative">
        <h2 className="text-lg font-bold mb-4">Agregar Ubicación</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Ubicación"
              disabled={isLoading} // Deshabilitar si está cargando
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
              className="w-full border p-2 rounded-md"
              placeholder="Descripción"
              rows={4}
              disabled={isLoading} // Deshabilitar si está cargando
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Pabellón</label>
            <input
              type="text"
              {...register('pabellon', { required: 'El pabellón es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Pabellón de la Ubicación"
              disabled={isLoading} // Deshabilitar si está cargando
            />
            {errors.pabellon && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pabellon.message}
              </p>
            )}
          </div>

          {isError && (
            <div className="text-red-500 mb-4">
              Error al crear la ubicación. Intenta de nuevo.
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default FormularioUbicacion;
