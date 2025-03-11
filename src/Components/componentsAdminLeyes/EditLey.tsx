import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Ley } from '../../types/ley';

interface EditLeyFormProps {
  ley: Ley;
  onSave: (id: number, updatedData: Partial<Ley>) => void;
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

  const onSubmit = (data: FormData) => {
    onSave(ley.id, data); // Llama a la función onSave con los datos actualizados
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Ley</h2>
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
            {errors.numLey && <p className="text-red-500 text-sm mt-1">{errors.numLey.message}</p>}
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
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
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
          
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancel} // Botón para cancelar la edición
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

export default EditLey;
