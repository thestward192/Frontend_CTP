import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Ubicacion } from '../../types/ubicacion';

interface EditUbicacionFormProps {
  ubicacion: Ubicacion;
  onSave: (id: number, updatedData: Partial<Ubicacion>) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  nombre: string;
  descripcion: string;
  pabellon: string;
}

const EditUbicacion: React.FC<EditUbicacionFormProps> = ({ ubicacion, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      nombre: ubicacion.nombre,
      descripcion: ubicacion.descripcion,
      pabellon: ubicacion.pabellon,
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await onSave(ubicacion.id, data);
    } catch (error) {
      console.error('Error al guardar la ubicación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md font-['DM Sans']">
        <h2 className="text-lg font-bold mb-4">Editar Ubicación</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label className="block mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Ubicación"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Pabellón <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('pabellon', { required: 'El pabellón es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Pabellón de la Ubicación"
            />
            {errors.pabellon && (
              <p className="text-red-500 text-sm mt-1">{errors.pabellon.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
              className="w-full border p-2 rounded-md"
              placeholder="Descripción de la Ubicación"
              rows={4}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUbicacion;
