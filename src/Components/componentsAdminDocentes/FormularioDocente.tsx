import React, { useState, useEffect } from 'react';
import { Ubicacion } from '../../types/ubicacion';
import { getUbicaciones } from '../../Services/ubicacionService';
import { useUsers } from '../../hooks/useUser';
import { useRoles } from '../../hooks/useRoles';

interface FormularioDocenteProps {
  onClose: () => void;
}

const FormularioDocente: React.FC<FormularioDocenteProps> = ({ onClose }) => {
  const { addUser } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_1: '',
    apellido_2: '',
    email: '',
    contraseña: '',
    rolId: 0,
    ubicacionIds: [] as number[],
  });
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUbicacionChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUbicacionIds = [...formData.ubicacionIds];
    newUbicacionIds[index] = Number(e.target.value);
    setFormData({ ...formData, ubicacionIds: newUbicacionIds });
  };

  const addUbicacionField = () => {
    setFormData({
      ...formData,
      ubicacionIds: [...formData.ubicacionIds, 0],
    });
  };

  const removeUbicacionField = (index: number) => {
    const newUbicacionIds = formData.ubicacionIds.filter((_, i) => i !== index);
    setFormData({ ...formData, ubicacionIds: newUbicacionIds });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">Agregar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
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
              value={formData.apellido_1}
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
              value={formData.apellido_2}
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
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rol</label>
            <select
              name="rolId"
              value={formData.rolId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
              disabled={rolesLoading}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>
          {formData.ubicacionIds.map((_, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700">Ubicación {index + 1}</label>
              <div className="flex">
                <select
                  name={`ubicacion_${index}`}
                  value={formData.ubicacionIds[index] || ''}
                  onChange={(e) => handleUbicacionChange(index, e)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                >
                  <option value="" disabled>
                    Selecciona una ubicación
                  </option>
                  {ubicaciones.map((ubicacion) => (
                    <option key={ubicacion.id} value={ubicacion.id}>
                      {ubicacion.nombre}
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

export default FormularioDocente;
