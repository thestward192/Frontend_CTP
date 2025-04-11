import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLeyes } from '../../hooks/useLey';

interface FormularioLeyProps {
  onClose: () => void;
  onLeyCreated: () => void;
}

interface FormData {
  numLey: string;
  nombre: string;
  detalle: string;
}

const FormularioLey: React.FC<FormularioLeyProps> = ({ onClose, onLeyCreated }) => {
  const { createLey } = useLeyes();
  const { handleSubmit, control, reset, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createLey(data);
      reset();
      onLeyCreated();
      onClose();
    } catch (error) {
      console.error('Error al crear la ley:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md font-['DM Sans']">
        <h2 className="text-xl font-bold mb-4">Agregar Ley</h2>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
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
                  placeholder="Número de la Ley"
                  className={`w-full border p-2 rounded-md ${errors.numLey ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.numLey && (
              <p className="text-red-500 text-sm mt-1">{errors.numLey.message}</p>
            )}
          </div>

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
                  placeholder="Nombre de la Ley"
                  className={`w-full border p-2 rounded-md ${errors.nombre ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">
              Detalle <span className="text-red-500">*</span>
            </label>
            <Controller
              name="detalle"
              control={control}
              rules={{
                required: 'El detalle de ley es obligatorio'
                // Si quisieras agregar un límite de caracteres, por ejemplo:
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

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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

export default FormularioLey;
