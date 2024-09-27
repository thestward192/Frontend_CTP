import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProveedores } from '../../hooks/useProveedor';
import { CreateProveedor } from '../../types/proveedor';

interface FormularioProveedorProps {
  onClose: () => void;
}

const FormularioProveedor: React.FC<FormularioProveedorProps> = ({ onClose }) => {
  const { handleSubmitProveedor } = useProveedores();
  const { handleSubmit, register, formState: { errors } } = useForm<CreateProveedor>();
  const [alertaVisible, setAlertaVisible] = useState(false); // Estado para controlar la visibilidad de la alerta

  const onSubmit = async (data: CreateProveedor) => {
    const success = await handleSubmitProveedor(data); // Usamos CreateProveedor sin id
    if (success) {
      setAlertaVisible(true); // Mostrar alerta de éxito
      setTimeout(() => {
        setAlertaVisible(false); // Ocultar la alerta después de 1.5 segundos
        onClose(); // Cerrar modal si el proveedor se creó con éxito
      }, 1500);
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
              {...register('nombreProveedor', { required: 'Este campo es obligatorio' })}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre del Proveedor"
            />
            {errors.nombreProveedor && <p className="text-red-500">{errors.nombreProveedor.message}</p>}
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
              className="w-full border p-2 rounded-md"
              placeholder="Correo Electrónico"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

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

export default FormularioProveedor;
