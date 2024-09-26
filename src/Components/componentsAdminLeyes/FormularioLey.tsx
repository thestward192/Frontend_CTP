import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLeyes } from '../../hooks/useLey';

interface FormularioLeyProps {
  onClose: () => void;
}

interface FormData {
  numLey: string;
  nombre: string;
  detalle: string;
}

const FormularioLey: React.FC<FormularioLeyProps> = ({ onClose }) => {
  const { createLey } = useLeyes();
  const { handleSubmit, control, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await createLey(data); // Enviar la nueva ley
      reset(); // Resetear el formulario
      onClose(); // Cerrar el modal al crear la ley
    } catch (error) {
      console.error('Error al crear la ley:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] relative">
        <h2 className="text-lg font-bold mb-4">Agregar Ley</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Número de Ley</label>
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
            {errors.numLey && <p className="text-red-500 text-sm">{errors.numLey.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
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
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
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

          {/* Botones de Crear y Cancelar */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioLey;
