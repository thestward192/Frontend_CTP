import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Ley } from '../../types/ley';

interface EditLeyFormProps {
  ley: Ley;
  onSave: (id: number, updatedData: Partial<Ley>) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  numLey: string;
  nombre: string;
  detalle: string;
}

const EditLey: React.FC<EditLeyFormProps> = ({ ley, onSave, onCancel }) => {
  const { handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      numLey: ley.numLey,
      nombre: ley.nombre,
      detalle: ley.detalle,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSave(ley.id, data);
    } catch (error) {
      console.error('Error al guardar los cambios de la ley:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md font-['DM Sans']">
        <h2 className="text-xl font-bold mb-4">Editar Ley</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Número de Ley */}
          <div className="mb-4">
            <label className="block mb-1">
              Número de Ley <span className="text-red-500">*</span>
            </label>
            <Controller
              name="numLey"
              control={control}
              rules={{
                required: 'El número de ley es obligatorio',
                maxLength: { value: 50, message: 'El número de ley no puede tener más de 50 caracteres' }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border p-2 rounded-md ${errors.numLey ? 'border-red-500' : ''}`}
                  placeholder="Número de la Ley"
                />
              )}
            />
            {errors.numLey && (
              <p className="text-red-500 text-sm mt-1">{errors.numLey.message}</p>
            )}
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label className="block mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Controller
              name="nombre"
              control={control}
              rules={{
                required: 'El nombre es obligatorio',
                maxLength: { value: 100, message: 'El nombre no puede tener más de 100 caracteres' }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border p-2 rounded-md ${errors.nombre ? 'border-red-500' : ''}`}
                  placeholder="Nombre de la Ley"
                />
              )}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Detalle */}
          <div className="mb-4">
            <label className="block mb-1">
              Detalle <span className="text-red-500">*</span>
            </label>
            <Controller
              name="detalle"
              control={control}
              rules={{
                required: 'El detalle de ley es obligatorio'
                // Si querés agregar un límite de caracteres para "detalle", descomenta la siguiente línea:
                // maxLength: { value: 1000, message: 'El detalle no puede tener más de 1000 caracteres' }
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  className={`w-full border p-2 rounded-md ${errors.detalle ? 'border-red-500' : ''}`}
                  placeholder="Detalle"
                  rows={4}
                />
              )}
            />
            {errors.detalle && (
              <p className="text-red-500 text-sm mt-1">{errors.detalle.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLey;
