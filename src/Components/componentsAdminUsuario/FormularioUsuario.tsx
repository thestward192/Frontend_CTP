import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form';
import Select, { GroupBase, SingleValue } from 'react-select';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRoles } from '../../hooks/useRoles';
import { useUsers } from '../../hooks/useUser';
import { useUbicacion } from '../../hooks/useUbicacion';
import { OptionType } from '../../types/proveedor';

interface FormularioDocenteProps {
  onClose: () => void;
}

interface FormData {
  nombre: string;
  apellido_1: string;
  apellido_2: string;
  email: string;
  contraseña: string;
  confirmarContraseña: string;
  rolId: number;
  ubicacionIds: number[];
}

const FormularioUsuario: React.FC<FormularioDocenteProps> = ({ onClose }) => {
  const { addUserMutation } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const { ubicaciones, loading: ubicacionesLoading, error: ubicacionesError } = useUbicacion('En Servicio');
  const [ubicacionFields, setUbicacionFields] = useState<number[]>([0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      apellido_1: '',
      apellido_2: '',
      email: '',
      contraseña: '',
      confirmarContraseña: '',
      rolId: 0,
      ubicacionIds: [] as number[],
    },
  });

  const contraseña = watch('contraseña');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await addUserMutation.mutateAsync(data);
      onClose();
      reset();
    } catch (error: any) {
      if (error.message.includes('El email ya está en uso')) {
        setError('email', { type: 'manual', message: 'Este email ya está en uso' });
      } else {
        console.error('Error al agregar el usuario:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addUbicacionField = () => {
    setUbicacionFields([...ubicacionFields, ubicacionFields.length]);
  };

  const removeUbicacionField = (index: number) => {
    setUbicacionFields(ubicacionFields.filter((_, i) => i !== index));
  };

  if (ubicacionesLoading) return <p>Cargando ubicaciones...</p>;
  if (ubicacionesError) return <p>Error al cargar las ubicaciones</p>;

  // Convertir la lista de ubicaciones en opciones para react‑select
  const ubicacionOptions: OptionType[] = ubicaciones.map((ubicacion) => ({
    value: ubicacion.id,
    label: ubicacion.nombre,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[600px] font-['DM Sans']">
        <h2 className="text-lg font-bold mb-4">Agregar Usuario</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos principales */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                placeholder="Escribe el nombre"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
            </div>
            {/* Primer Apellido */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Primer Apellido <span className="text-red-500">*</span>
              </label>
              <input
                {...register('apellido_1', { required: 'El primer apellido es obligatorio' })}
                placeholder="Escribe el primer apellido"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.apellido_1 && <p className="text-red-500 text-sm">{errors.apellido_1.message}</p>}
            </div>
            {/* Segundo Apellido */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Segundo Apellido <span className="text-red-500">*</span>
              </label>
              <input
                {...register('apellido_2', { required: 'El segundo apellido es obligatorio' })}
                placeholder="Escribe el segundo apellido"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.apellido_2 && <p className="text-red-500 text-sm">{errors.apellido_2.message}</p>}
            </div>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'El email es obligatorio',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' },
                })}
                placeholder="Escribe el correo electrónico"
                className={`w-full border p-2 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            {/* Contraseña */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('contraseña', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
                  })}
                  placeholder="Escribe la contraseña"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.contraseña && <p className="text-red-500 text-sm">{errors.contraseña.message}</p>}
            </div>
            {/* Confirmar Contraseña */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmarContraseña', {
                    required: 'Confirma la contraseña',
                    validate: (value) =>
                      value === contraseña || 'Las contraseñas no coinciden',
                  })}
                  placeholder="Confirma tu contraseña"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmarContraseña && (
                <p className="text-red-500 text-sm">{errors.confirmarContraseña.message}</p>
              )}
            </div>
            {/* Rol */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Rol <span className="text-red-500">*</span>
              </label>
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
              {errors.rolId && <p className="text-red-500 text-sm">{errors.rolId.message}</p>}
            </div>
          </div>

          {/* Campos dinámicos para Ubicaciones usando react‑select */}
          {ubicacionFields.map((_, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700">Ubicación {index + 1}</label>
              <div className="flex">
                <Controller
                  name={`ubicacionIds.${index}`}
                  control={control}
                  render={({ field }) => (
                    <Select<OptionType, false, GroupBase<OptionType>>
                      options={ubicacionOptions}
                      placeholder="Selecciona una ubicación"
                      value={ubicacionOptions.find(option => option.value === field.value) || null}
                      onChange={(selectedOption: SingleValue<OptionType>) => {
                        field.onChange(selectedOption?.value);
                      }}
                      className="w-full"
                      classNamePrefix="react-select"
                      // Renderiza el menú en un portal para evitar que se corte
                      menuPortalTarget={document.body}
                      // Asegura que el menú se muestre por encima de todo
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        menu: (base) => ({
                          ...base,
                          maxHeight: 200,
                          overflowY: 'auto',
                        }),
                      }}
                      isSearchable
                    />
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

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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

export default FormularioUsuario;
