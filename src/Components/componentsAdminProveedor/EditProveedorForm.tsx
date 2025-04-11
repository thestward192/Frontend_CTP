import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Proveedor } from '../../types/proveedor';

interface EditProveedorFormProps {
  proveedor: Proveedor;
  onSave: (id: number, updatedData: Partial<Proveedor>) => Promise<void>;
  onCancel: () => void;
}

const EditProveedorForm: React.FC<EditProveedorFormProps> = ({ proveedor, onSave, onCancel }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Proveedor>({
    defaultValues: {
      vendedor: proveedor.vendedor,
      nombreEmpresa: proveedor.nombreEmpresa,
      telefonoProveedor: proveedor.telefonoProveedor,
      telefonoEmpresa: proveedor.telefonoEmpresa,
      email: proveedor.email,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para formatear el teléfono en tiempo real
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
    if (input.length > 4) {
      input = `${input.slice(0, 4)}-${input.slice(4, 8)}`;
    }
    setValue(e.target.name as keyof Proveedor, input); // Actualizar el valor con el guion
  };

  const onSubmit = async (data: Proveedor) => {
    setIsSubmitting(true);
    try {
      await onSave(proveedor.id, data);
    } catch (error) {
      console.error('Error al guardar los cambios del proveedor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md font-['DM Sans']">
        <h2 className="text-xl font-bold mb-4">Editar Proveedor</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Vendedor */}
          <div className="mb-4">
            <label className="block mb-1">
              Nombre del Proveedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('vendedor', { 
                required: 'Este campo es obligatorio', 
                maxLength: { value: 100, message: 'No puede tener más de 100 caracteres' }
              })}
              className={`w-full border p-2 rounded-md ${errors.vendedor ? 'border-red-500' : ''}`}
              placeholder="Nombre del Proveedor"
            />
            {errors.vendedor && (
              <p className="text-red-500 text-sm mt-1">{errors.vendedor.message}</p>
            )}
          </div>

          {/* Nombre de la Empresa */}
          <div className="mb-4">
            <label className="block mb-1">
              Nombre de la Empresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nombreEmpresa', { 
                required: 'Este campo es obligatorio',
                maxLength: { value: 100, message: 'No puede tener más de 100 caracteres' }
              })}
              className={`w-full border p-2 rounded-md ${errors.nombreEmpresa ? 'border-red-500' : ''}`}
              placeholder="Nombre de la Empresa"
            />
            {errors.nombreEmpresa && (
              <p className="text-red-500 text-sm mt-1">{errors.nombreEmpresa.message}</p>
            )}
          </div>

          {/* Teléfono del Proveedor */}
          <div className="mb-4">
            <label className="block mb-1">
              Teléfono del Proveedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('telefonoProveedor', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: 'El formato debe ser ####-####',
                },
                maxLength: {
                  value: 9,
                  message: 'El teléfono no puede tener más de 9 caracteres',
                },
              })}
              className={`w-full border p-2 rounded-md ${errors.telefonoProveedor ? 'border-red-500' : ''}`}
              placeholder="####-####"
              onChange={handlePhoneInput}
              maxLength={9}
            />
            {errors.telefonoProveedor && (
              <p className="text-red-500 text-sm mt-1">{errors.telefonoProveedor.message}</p>
            )}
          </div>

          {/* Teléfono de la Empresa */}
          <div className="mb-4">
            <label className="block mb-1">
              Teléfono de la Empresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('telefonoEmpresa', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: 'El formato debe ser ####-####',
                },
                maxLength: {
                  value: 9,
                  message: 'El teléfono no puede tener más de 9 caracteres',
                },
              })}
              className={`w-full border p-2 rounded-md ${errors.telefonoEmpresa ? 'border-red-500' : ''}`}
              placeholder="####-####"
              onChange={handlePhoneInput}
              maxLength={9}
            />
            {errors.telefonoEmpresa && (
              <p className="text-red-500 text-sm mt-1">{errors.telefonoEmpresa.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Formato de email inválido',
                },
              })}
              className={`w-full border p-2 rounded-md ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Correo Electrónico"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Botones */}
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
