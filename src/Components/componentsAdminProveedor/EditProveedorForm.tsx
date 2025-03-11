import React from 'react';
import { Proveedor } from '../../types/proveedor';
import { useForm } from 'react-hook-form';

interface EditProveedorFormProps {
  proveedor: Proveedor;
  onSave: (id: number, updatedData: Partial<Proveedor>) => void;
  onCancel: () => void;
}

const EditProveedorForm: React.FC<EditProveedorFormProps> = ({ proveedor, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Proveedor>({
    defaultValues: {
      vendedor: proveedor.vendedor,
      nombreEmpresa: proveedor.nombreEmpresa,
      telefonoProveedor: proveedor.telefonoProveedor,
      telefonoEmpresa: proveedor.telefonoEmpresa,
      email: proveedor.email,
    },
  });

  const onSubmit = (data: Proveedor) => {
    // No es necesario formatear los números de teléfono, simplemente pasa los datos tal cual
    onSave(proveedor.id, data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Proveedor</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Nombre del Proveedor</label>
            <input
              type="text"
              {...register('vendedor', { required: 'Este campo es obligatorio' })}
              className={`w-full border p-2 rounded-md ${errors.vendedor ? 'border-red-500' : ''}`}
            />
            {errors.vendedor && (
              <p className="text-red-500 text-sm">{errors.vendedor.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nombre de la Empresa</label>
            <input
              type="text"
              {...register('nombreEmpresa', { required: 'Este campo es obligatorio' })}
              className={`w-full border p-2 rounded-md ${errors.nombreEmpresa ? 'border-red-500' : ''}`}
            />
            {errors.nombreEmpresa && (
              <p className="text-red-500 text-sm">{errors.nombreEmpresa.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Teléfono del Proveedor</label>
            <input
              type="text"
              {...register('telefonoProveedor', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: 'El formato debe ser ####-####',
                },
              })}
              className={`w-full border p-2 rounded-md ${errors.telefonoProveedor ? 'border-red-500' : ''}`}
            />
            {errors.telefonoProveedor && (
              <p className="text-red-500 text-sm">{errors.telefonoProveedor.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Teléfono de la Empresa</label>
            <input
              type="text"
              {...register('telefonoEmpresa', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: 'El formato debe ser ####-####',
                },
              })}
              className={`w-full border p-2 rounded-md ${errors.telefonoEmpresa ? 'border-red-500' : ''}`}
            />
            {errors.telefonoEmpresa && (
              <p className="text-red-500 text-sm">{errors.telefonoEmpresa.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Este campo es obligatorio' })}
              className={`w-full border p-2 rounded-md ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
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
              onClick={onCancel}
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

export default EditProveedorForm;
