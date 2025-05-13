import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProveedores } from '../../hooks/useProveedor';
import { CreateProveedor } from '../../types/proveedor';

interface FormularioProveedorProps {
  onClose: () => void;
  onProveedorCreated: () => void;
}

const FormularioProveedor: React.FC<FormularioProveedorProps> = ({ onClose, onProveedorCreated }) => {
  const { handleSubmitProveedor } = useProveedores();
  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateProveedor>();
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para formatear el teléfono automáticamente
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter que no sea un número
    if (input.length <= 4) {
      e.target.value = input;
    } else {
      e.target.value = `${input.slice(0, 4)}-${input.slice(4, 8)}`; // Inserta el guion automáticamente
    }
  };

  const onSubmit = async (data: CreateProveedor) => {
    setIsSubmitting(true);
    try {
      await handleSubmitProveedor.mutateAsync(data);
      setAlertaVisible(true);
      setTimeout(() => {        setAlertaVisible(false);
        reset();
        onProveedorCreated();
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error('Error capturado:', error.message);
      if (error.message.includes('El email ya está en uso')) {
        setError('email', { type: 'manual', message: 'Este email ya está registrado' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative font-['DM Sans']">
        {alertaVisible && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            <p>Proveedor creado exitosamente</p>
          </div>
        )}
        <h2 className="text-lg font-bold mb-4">Agregar Proveedor</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label className="block mb-1">
              Nombre del Proveedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('vendedor', { 
                required: 'Este campo es obligatorio', 
                maxLength: { value: 100, message: 'El nombre del proveedor no puede tener más de 100 caracteres' }
              })}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre del Proveedor"
            />
            {errors.vendedor && (
              <p className="text-red-500 text-sm mt-1">{errors.vendedor.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">
              Nombre de la Empresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nombreEmpresa', { 
                required: 'Este campo es obligatorio',
                maxLength: { value: 100, message: 'El nombre de la empresa no puede tener más de 100 caracteres' }
              })}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Empresa"
            />
            {errors.nombreEmpresa && (
              <p className="text-red-500 text-sm mt-1">{errors.nombreEmpresa.message}</p>
            )}
          </div>

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
                  message: 'El teléfono debe tener el formato ####-####',
                },
                maxLength: { value: 9, message: 'El teléfono no puede tener más de 8 caracteres' }
              })}
              className="w-full border p-2 rounded-md"
              placeholder="####-####"
              onChange={handlePhoneInput}
            />
            {errors.telefonoProveedor && (
              <p className="text-red-500 text-sm mt-1">{errors.telefonoProveedor.message}</p>
            )}
          </div>

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
                  message: 'El teléfono debe tener el formato ####-####',
                },
                maxLength: { value: 9, message: 'El teléfono no puede tener más de 8 caracteres' }
              })}
              className="w-full border p-2 rounded-md"
              placeholder="####-####"
              onChange={handlePhoneInput}
            />
            {errors.telefonoEmpresa && (
              <p className="text-red-500 text-sm mt-1">{errors.telefonoEmpresa.message}</p>
            )}
          </div>

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
              className={`w-full border p-2 rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Correo Electrónico"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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

export default FormularioProveedor;
