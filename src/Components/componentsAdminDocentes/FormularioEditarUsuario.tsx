import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../types/user';
import { useUbicacion } from '../../hooks/useUbicacion'; 
import { useUsers } from '../../hooks/useUser';
import { useRoles } from '../../hooks/useRoles'; // Hook para obtener los roles

interface FormularioEditarUsuarioProps {
  userId: number;
  onClose: () => void;
  onSave: (userId: number, updatedData: Partial<User>) => void;
}

const FormularioEditarUsuario: React.FC<FormularioEditarUsuarioProps> = ({ userId, onClose }) => {
  const { editUserMutation, users } = useUsers();
  const { ubicaciones, loading: ubicacionesLoading } = useUbicacion();
  const { roles, loading: rolesLoading } = useRoles(); // Obtener roles

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Partial<User>>();

  const [ubicacionFields, setUbicacionFields] = useState<number[]>([0]);

  // Obtener detalles del usuario desde `users`
  useEffect(() => {
    const selectedUser = users?.find((user) => user.id === userId);
    if (selectedUser) {
      setValue('nombre', selectedUser.nombre);
      setValue('apellido_1', selectedUser.apellido_1);
      setValue('apellido_2', selectedUser.apellido_2);
      setValue('email', selectedUser.email);
      setValue('rol', selectedUser.rol?.id || '');
  
      // Asignar las ubicaciones correctamente
      setUbicacionFields(
        selectedUser.ubicaciones?.map((ubicacion) => ubicacion.id) || []
      );
    }
  }, [userId, users, setValue, setUbicacionFields]);
  

  const onSubmit = (data: Partial<User>) => {
    editUserMutation.mutate({ userId, updatedData: data });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Primer Apellido</label>
            <input
              {...register('apellido_1', { required: 'El primer apellido es obligatorio' })}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            {errors.apellido_1 && <p className="text-red-500">{errors.apellido_1.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Segundo Apellido</label>
            <input
              {...register('apellido_2', { required: 'El segundo apellido es obligatorio' })}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            {errors.apellido_2 && <p className="text-red-500">{errors.apellido_2.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'El correo electrónico es obligatorio' })}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Rol</label>
            <select
              {...register('rol', { required: 'El rol es obligatorio' })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              disabled={rolesLoading}
            >
              <option value="">Selecciona un rol</option>
              {roles?.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            {errors.rol && <p className="text-red-500">{errors.rol.message}</p>}
          </div>

          {/* Ubicaciones (sin cambios, como estaban antes) */}
          <div className="mb-4">
            <label className="block text-gray-700">Ubicaciones</label>
            {ubicacionFields.map((index) => (
              <div key={index} className="mb-2">
                <select
                  name={`ubicaciones.${index}`}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  disabled={ubicacionesLoading}
                >
                  <option value="">Selecciona una ubicación</option>
                  {ubicaciones.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre}
                    </option>
                  ))}
                </select>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => setUbicacionFields(ubicacionFields.filter((_, i) => i !== index))}
                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Quitar
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => setUbicacionFields([...ubicacionFields, ubicacionFields.length])}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Añadir otra ubicación
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarUsuario;
