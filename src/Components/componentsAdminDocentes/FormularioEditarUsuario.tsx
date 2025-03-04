import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../types/user';
import { getUserById } from '../../Services/userService';
import { useUbicacion } from '../../hooks/useUbicacion'; // Importamos el hook de ubicaciones

interface FormularioEditarUsuarioProps {
  userId: number;
  onClose: () => void;
  onSave: (userId: number, updatedData: Partial<User>) => void;
}

const FormularioEditarUsuario: React.FC<FormularioEditarUsuarioProps> = ({ userId, onClose, onSave }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<User>>(); 
  const [user, setUser] = useState<User | null>(null);

  // Usamos el hook de ubicaciones para traer las ubicaciones y manejar el loading y error.
  const { ubicaciones, loading: ubicacionesLoading, error: ubicacionesError } = useUbicacion();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
        setValue('nombre', userData.nombre); 
        setValue('apellido_1', userData.apellido_1);
        setValue('apellido_2', userData.apellido_2);
        setValue('email', userData.email);
      } catch (error) {
        console.error('Error al obtener los detalles del usuario:', error);
      }
    };

    fetchUserDetails();
  }, [userId, setValue]);

  const contraseña = watch('contraseña');

  const handleUbicacionChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUbicacionIds = [...(user?.ubicaciones || [])];
    newUbicacionIds[index] = { ...newUbicacionIds[index], id: Number(e.target.value) };
    setUser({ ...user, ubicaciones: newUbicacionIds } as User);
  };

  const addUbicacionField = () => {
    setUser({
      ...user,
      ubicaciones: [...(user?.ubicaciones || []), { id: 0, nombre: '' }],
    } as User);
  };

  const removeUbicacionField = (index: number) => {
    const newUbicacionIds = user?.ubicaciones?.filter((_, i) => i !== index) || [];
    setUser({ ...user, ubicaciones: newUbicacionIds } as User);
  };

  const onSubmit = (data: Partial<User>) => {
    onSave(userId, { ...data, ubicaciones: user?.ubicaciones || [] });
    onClose();
  };

  if (!user) return null;

  if (ubicacionesLoading) return <p>Cargando ubicaciones...</p>;
  if (ubicacionesError) return <p>Error al cargar las ubicaciones</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              autoComplete='off'
              {...register('contraseña')}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            {errors.contraseña && <p className="text-red-500">{errors.contraseña.message}</p>}
          </div> 

          <div className="mb-4">
              <label className="block text-gray-700">Confirmar Contraseña</label>
              <input
                type="password"
                {...register('confirmarContraseña', {
                  required: 'Confirma la contraseña',
                  validate: (value) => value === contraseña || 'Las contraseñas no coinciden',
                })}
                placeholder="Confirma tu contraseña"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.confirmarContraseña && <p className="text-red-500">{errors.confirmarContraseña.message}</p>}
            </div>


          {/* Manejo de ubicaciones */}
          {user.ubicaciones && user.ubicaciones.map((ubicacion, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700">Ubicación {index + 1}</label>
              <div className="flex">
                <select
                  name={`ubicacion_${index}`}
                  value={ubicacion.id || ''}
                  onChange={(e) => handleUbicacionChange(index, e)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                >
                  <option value="" disabled>
                    Selecciona una ubicación
                  </option>
                  {ubicaciones.map((ub) => (
                    <option key={ub.id} value={ub.id}>
                      {ub.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeUbicacionField(index)}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <div className="mb-4">
            <button
              type="button"
              onClick={addUbicacionField}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Añadir otra ubicación
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onClick={onClose}>
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
