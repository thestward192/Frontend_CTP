import React from 'react';
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

  const onSubmit = async (data: FormData) => {
    try {
      await createLey(data); // Enviar la nueva ley
      reset(); // Resetear el formulario
      onLeyCreated();
      onClose(); // Cerrar el modal al crear la ley
    } catch (error) {
      console.error('Error al crear la ley:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md font-['DM Sans']">
        <h2 className="text-xl font-bold mb-4">Agregar Ley</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label className="block mb-1">
              Número de Ley <span className="text-red-500">*</span>
            </label>
            <Controller
              name="numLey"
              control={control}
              rules={{ required: 'El número de ley es obligatorio' }}
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

          <div className="mb-4">
            <label className="block mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es obligatorio' }}
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

          <div className="mb-4">
            <label className="block mb-1">Detalle</label>
            <Controller
              name="detalle"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full border p-2 rounded-md"
                  placeholder="Detalle"
                  rows={4}
                />
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Guardar
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
  );
};

export default FormularioLey;
