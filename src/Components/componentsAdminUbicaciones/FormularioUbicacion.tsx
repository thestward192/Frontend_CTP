import React, { useState } from 'react';
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

const FormularioUbicacion: React.FC<FormularioUbicacionProps> = ({ onClose, onUbicacionCreated }) => {
  const { handleSubmitUbicacion, isLoading, isError } = useUbicacion();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await handleSubmitUbicacion(data, {
        onSuccess: () => {
          onUbicacionCreated();
          onClose();
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejador para formatear el teléfono (si se requiriera en algún campo; no se usa en este formulario)
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 4) {
      e.target.value = input;
    } else {
      e.target.value = `${input.slice(0, 4)}-${input.slice(4, 8)}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md font-['DM Sans']">
        <h2 className="text-lg font-bold mb-4">Agregar Ubicación</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="mb-4">
            <label className="block mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Ubicación"
              disabled={isLoading || isSubmitting}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
              className="w-full border p-2 rounded-md"
              placeholder="Descripción"
              rows={4}
              disabled={isLoading || isSubmitting}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Pabellón */}
          <div className="mb-4">
            <label className="block mb-1">
              Pabellón <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('pabellon', { required: 'El pabellón es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Pabellón de la Ubicación"
              disabled={isLoading || isSubmitting}
            />
            {errors.pabellon && (
              <p className="text-red-500 text-sm mt-1">{errors.pabellon.message}</p>
            )}
          </div>

          {isError && (
            <div className="text-red-500 mb-4">
              Error al crear la ubicación. Intenta de nuevo.
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${
                isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading || isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              disabled={isLoading || isSubmitting}
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
