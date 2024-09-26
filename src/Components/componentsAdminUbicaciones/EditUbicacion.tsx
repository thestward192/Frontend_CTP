import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Ubicacion } from '../../types/ubicacion';

interface EditUbicacionFormProps {
  ubicacion: Ubicacion;
  onSave: (id: number, updatedData: Partial<Ubicacion>) => void;
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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    onSave(ubicacion.id, data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Ubicación</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Pabellón</label>
            <input
              type="text"
              {...register('pabellon', { required: 'El pabellón es obligatorio' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.pabellon && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pabellon.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUbicacion;
