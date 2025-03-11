import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProveedores } from '../../hooks/useProveedor';
import { CreateProveedor } from '../../types/proveedor';

interface FormularioProveedorProps {
  onClose: () => void;
}

const FormularioProveedor: React.FC<FormularioProveedorProps> = ({ onClose }) => {
  const { handleSubmitProveedor } = useProveedores();
  const { handleSubmit, register, setError, formState: { errors } } = useForm<CreateProveedor>();
  const [alertaVisible, setAlertaVisible] = useState(false); // Estado para controlar la visibilidad de la alerta

  // Función para formatear el teléfono automáticamente
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter que no sea un número
    if (input.length <= 4) {
      e.target.value = input; // Muestra solo los primeros 4 dígitos
    } else {
      e.target.value = `${input.slice(0, 4)}-${input.slice(4, 8)}`; // Inserta el guion automáticamente
    }
  };

  const onSubmit = async (data: CreateProveedor) => {
    try {
      await handleSubmitProveedor.mutateAsync(data);
      setAlertaVisible(true);
      setTimeout(() => {
        setAlertaVisible(false);
        reset();
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error capturado:', error.message);
  
      // 🔥 Si el mensaje del backend es "El email ya está en uso", mostramos el error
      if (error.message.includes('El email ya está en uso')) {
        setError('email', { type: 'manual', message: 'Este email ya está registrado' });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] relative">
        {alertaVisible && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            <p>Proveedor creado exitosamente</p>
          </div>
        )}
        <h2 className="text-lg font-bold mb-4">Agregar Proveedor</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Nombre del Proveedor</label>
            <input
              type="text"
              {...register('vendedor', { required: 'Este campo es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre del Proveedor"
            />
            {errors.vendedor && <p className="text-red-500">{errors.vendedor.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nombre de la Empresa</label>
            <input
              type="text"
              {...register('nombreEmpresa', { required: 'Este campo es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Empresa"
            />
            {errors.nombreEmpresa && <p className="text-red-500">{errors.nombreEmpresa.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Teléfono del Proveedor</label>
            <input
              type="text"
              {...register('telefonoProveedor', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: 'El teléfono debe tener el formato ####-####'
                }
              })}
              className="w-full border p-2 rounded-md"
              placeholder="####-####"
              onChange={handlePhoneInput} // Manejador para formateo automático
            />
            {errors.telefonoProveedor && <p className="text-red-500">{errors.telefonoProveedor.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Teléfono de la Empresa</label>
            <input
              type="text"
              {...register('telefonoEmpresa', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: 'El teléfono debe tener el formato ####-####'
                }
              })}
              className="w-full border p-2 rounded-md"
              placeholder="####-####"
              onChange={handlePhoneInput} // Manejador para formateo automático
            />
            {errors.telefonoEmpresa && <p className="text-red-500">{errors.telefonoEmpresa.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Formato de email inválido'
                }
              })}
              className={`w-full border p-2 rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Correo Electrónico"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
              onClick={onClose}
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

export default FormularioProveedor;
