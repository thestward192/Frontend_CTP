import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../types/user';
import { getUserById } from '../../Services/userService';
import { useUbicacion } from '../../hooks/useUbicacion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Select, { GroupBase, SingleValue } from 'react-select';
import { OptionType } from '../../types/proveedor';

interface FormularioEditarUsuarioProps {
  userId: number;
  onClose: () => void;
  onSave: (userId: number, updatedData: Partial<User>) => void;
}

const FormularioEditarUsuario: React.FC<FormularioEditarUsuarioProps> = ({ userId, onClose, onSave }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<User>>();
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Para manejar las ubicaciones del usuario
  const { ubicaciones, loading: ubicacionesLoading, error: ubicacionesError } = useUbicacion();

  // Función para actualizar una ubicación específica
  const handleUbicacionChange = (index: number, selectedOption: SingleValue<OptionType>) => {
    const newUbicacionId = selectedOption ? selectedOption.value : 0;
    const newUbicaciones = user?.ubicaciones ? [...user.ubicaciones] : [];
    newUbicaciones[index] = { ...newUbicaciones[index], id: newUbicacionId };
    setUser({ ...user!, ubicaciones: newUbicaciones });
  };

  const addUbicacionField = () => {
    setUser({
      ...user!,
      ubicaciones: user?.ubicaciones ? [...user.ubicaciones, { id: 0, nombre: '' }] : [{ id: 0, nombre: '' }],
    });
  };

  const removeUbicacionField = (index: number) => {
    const newUbicaciones = user?.ubicaciones?.filter((_, i) => i !== index) || [];
    setUser({ ...user!, ubicaciones: newUbicaciones });
  };

  // Cargar datos del usuario
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

  const onSubmit = async (data: Partial<User>) => {
    setIsSubmitting(true);
    try {
      const updateData = { ...data };
      if (!contraseña) {
        delete updateData.contraseña;
      }
      onSave(userId, { ...updateData, ubicaciones: user?.ubicaciones || [] });
      onClose();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;
  if (ubicacionesLoading) return <p>Cargando ubicaciones...</p>;
  if (ubicacionesError) return <p>Error al cargar las ubicaciones</p>;

  // Convertimos la lista de ubicaciones a opciones para react‑select
  const ubicacionOptions: OptionType[] = ubicaciones.map((ub) => ({
    value: ub.id,
    label: ub.nombre,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[600px] font-['DM Sans']">
        <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos de datos básicos */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                {...register('nombre', { required: 'El nombre es obligatorio' })}
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
                {...register('email', { required: 'El correo electrónico es obligatorio' })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </div>

          {/* Contraseña y Confirmar Contraseña */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
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
            <div>
              <label className="block text-gray-700">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('confirmarContraseña', {
                    required: 'Confirma la contraseña',
                    validate: (value) => value === watch('contraseña') || 'Las contraseñas no coinciden',
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
          </div>

          {/* Manejo de ubicaciones con react‑select */}
          {user.ubicaciones && user.ubicaciones.map((ubicacion, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700">Ubicación {index + 1}</label>
              <div className="flex">
                <Select<OptionType, false, GroupBase<OptionType>>
                  isSearchable
                  options={ubicacionOptions}  // Asegúrate de declarar: const ubicacionOptions = ubicaciones.map(ub => ({ value: ub.id, label: ub.nombre }));
                  placeholder="Selecciona una ubicación"
                  value={ubicacionOptions.find(option => option.value === ubicacion.id) || null}
                  onChange={(selectedOption: SingleValue<OptionType>) => {
                    handleUbicacionChange(index, selectedOption);
                  }}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (provided) => ({ ...provided, maxHeight: 200, overflowY: 'auto' }),
                  }}
                  className="w-full"
                  classNamePrefix="react-select"
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

export default FormularioEditarUsuario;
