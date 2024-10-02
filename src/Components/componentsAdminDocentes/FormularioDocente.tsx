import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Ubicacion } from '../../types/ubicacion';
import { getUbicaciones } from '../../Services/ubicacionService';
import { useRoles } from '../../hooks/useRoles';
import { useUsers } from '../../hooks/useUser';

interface FormularioDocenteProps {
  onClose: () => void;
}

const FormularioDocente: React.FC<FormularioDocenteProps> = ({ onClose }) => {
  const { addUserMutation } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [ubicacionFields, setUbicacionFields] = useState<number[]>([0]);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      nombre: '',
      apellido_1: '',
      apellido_2: '',
      email: '',
      contraseña: '',
      rolId: 0,
      ubicacionIds: [] as number[],
    },
  });

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const data = await getUbicaciones();
        setUbicaciones(data);
      } catch (error) {
        console.error('Error al obtener las ubicaciones', error);
      }
    };

    fetchUbicaciones();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await addUserMutation.mutateAsync(data);
      onClose();
      reset();
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
    }
  };

  const addUbicacionField = () => {
    setUbicacionFields([...ubicacionFields, ubicacionFields.length]);
  };

  const removeUbicacionField = (index: number) => {
    setUbicacionFields(ubicacionFields.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]"> {/* Ancho ajustado */}
        <h2 className="text-lg font-bold mb-4">Agregar Usuario</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Dividimos el formulario en columnas */}
          <div className="grid grid-cols-2 gap-4"> {/* Definimos el grid en dos columnas */}
            <div className="mb-4">
              <label className="block text-gray-700">Nombre</label>
              <input
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                placeholder="Escribe el nombre"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Primer Apellido</label>
              <input
                {...register('apellido_1', { required: 'El primer apellido es obligatorio' })}
                placeholder="Escribe el primer apellido"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.apellido_1 && <p className="text-red-500">{errors.apellido_1.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Segundo Apellido</label>
              <input
                {...register('apellido_2', { required: 'El segundo apellido es obligatorio' })}
                placeholder="Escribe el segundo apellido"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.apellido_2 && <p className="text-red-500">{errors.apellido_2.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                {...register('email', {
                  required: 'El email es obligatorio',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' },
                })}
                placeholder="Escribe el correo electrónico"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                {...register('contraseña', {
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
                })}
                placeholder="Escribe la contraseña"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.contraseña && <p className="text-red-500">{errors.contraseña.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Rol</label>
              <select
                {...register('rolId', { required: 'El rol es obligatorio' })}
                className="w-full border border-gray-300 p-2 rounded-lg"
                disabled={rolesLoading}
              >
                <option value="">Selecciona un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              {errors.rolId && <p className="text-red-500">{errors.rolId.message}</p>}
            </div>
          </div>

          {/* Campos de ubicaciones */}
          {ubicacionFields.map((_, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700">Ubicación {index + 1}</label>
              <div className="flex">
                <Controller
                  name={`ubicacionIds.${index}`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border border-gray-300 p-2 rounded-lg"
                    >
                      <option value="">Selecciona una ubicación</option>
                      {ubicaciones.map((ubicacion) => (
                        <option key={ubicacion.id} value={ubicacion.id}>
                          {ubicacion.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                />
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioDocente;
