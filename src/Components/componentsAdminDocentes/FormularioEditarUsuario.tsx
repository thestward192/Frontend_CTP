import React, { useState, useEffect } from 'react';
import { User } from '../../types/user';
import { getUserById } from '../../Services/userService';
import { Ubicacion } from '../../types/ubicacion';
import { getUbicaciones } from '../../Services/ubicacionService';

interface FormularioEditarUsuarioProps {
  userId: number;
  onClose: () => void;
  onSave: (userId: number, updatedData: Partial<User>) => void;
}

const FormularioEditarUsuario: React.FC<FormularioEditarUsuarioProps> = ({ userId, onClose, onSave }) => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
        setFormData({
          nombre: userData.nombre,
          apellido_1: userData.apellido_1,
          apellido_2: userData.apellido_2,
          email: userData.email,
          rol: userData.rol,
          ubicaciones: userData.ubicaciones || [],
        });
      } catch (error) {
        console.error('Error al obtener los detalles del usuario:', error);
      }
    };

    const fetchUbicaciones = async () => {
      try {
        const ubicacionesData = await getUbicaciones();
        setUbicaciones(ubicacionesData);
      } catch (error) {
        console.error('Error al obtener las ubicaciones:', error);
      }
    };

    fetchUserDetails();
    fetchUbicaciones();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUbicacionChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUbicacionIds = [...(formData.ubicaciones || [])];
    newUbicacionIds[index] = { ...newUbicacionIds[index], id: Number(e.target.value) };
    setFormData({ ...formData, ubicaciones: newUbicacionIds });
  };

  const addUbicacionField = () => {
    setFormData({
      ...formData,
      ubicaciones: [...(formData.ubicaciones || []), { id: 0, nombre: '' }],
    });
  };

  const removeUbicacionField = (index: number) => {
    const newUbicacionIds = formData.ubicaciones?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, ubicaciones: newUbicacionIds });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(userId, formData);
    onClose();
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Primer Apellido</label>
            <input
              type="text"
              name="apellido_1"
              value={formData.apellido_1 || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Segundo Apellido</label>
            <input
              type="text"
              name="apellido_2"
              value={formData.apellido_2 || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          {formData.ubicaciones && formData.ubicaciones.map((ubicacion, index) => (
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
