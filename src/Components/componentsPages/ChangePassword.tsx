import React from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

interface ChangePasswordProps {
  onPasswordChangeSuccess: () => void;
}

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onPasswordChangeSuccess }) => {
  const navigate = useNavigate();
  const { register, handleSubmit,  formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      swal('Error', 'Las nuevas contraseñas no coinciden', 'error');
      return;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*.])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    if (!passwordPattern.test(data.newPassword)) {
      swal('Error', 'La nueva contraseña debe tener al menos una letra mayúscula, un carácter especial, un número y una longitud mínima de 8 caracteres', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado, por favor inicie sesión.');

      await axios.patch (
        'http://localhost:3000/auth/change-password',
        {
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      localStorage.removeItem('token');
      swal("Éxito", "Tu contraseña ha sido cambiada exitosamente. Por favor, vuelve a iniciar sesión.", "success");
      onPasswordChangeSuccess();
      navigate('/');
    } catch (err: any) {
      swal("Error", err.response?.data?.message || 'Error al cambiar la contraseña', "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Cambiar Contraseña</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="currentPassword">Contraseña Actual</label>
            <input
              className="w-full p-3 border rounded-lg focus:border-blue-500 focus:outline-none"
              type="password"
              id="currentPassword"
              placeholder="Ingresa tu contraseña actual"
              {...register('currentPassword', { required: 'Este campo es obligatorio' })}
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="newPassword">Nueva Contraseña</label>
            <input
              className="w-full p-3 border rounded-lg focus:border-blue-500 focus:outline-none"
              type="password"
              id="newPassword"
              placeholder="Ingresa tu nueva contraseña"
              {...register('newPassword', { required: 'Este campo es obligatorio' })}
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold mb-1" htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
            <input
              className="w-full p-3 border rounded-lg focus:border-blue-500 focus:outline-none"
              type="password"
              id="confirmNewPassword"
              placeholder="Confirma tu nueva contraseña"
              {...register('confirmNewPassword', { required: 'Este campo es obligatorio' })}
            />
            {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg mb-2 hover:bg-blue-700 transition duration-200"
          >
            Cambiar Contraseña
          </button>
          <button
            type="button"
            className="w-full bg-gray-300 text-black font-bold p-3 rounded-lg hover:bg-gray-400 transition duration-200"
            onClick={onPasswordChangeSuccess}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;


