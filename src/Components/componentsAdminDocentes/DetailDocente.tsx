import React, { useEffect, useState } from 'react';
import { User } from '../../types/user';
import { getUserById } from '../../Services/userService';

interface DetailUsuariosProps {
  userId: number;
  onClose: () => void;
  onEdit: (userId: number) => void; // Agregamos el ID del usuario para la edición
}

const DetailUsuarios: React.FC<DetailUsuariosProps> = ({ userId, onClose, onEdit }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Error al obtener los detalles del usuario:', error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!user) return null; // No mostrar nada si no se ha cargado el usuario

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">Detalles del Usuario</h2>
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Primer Apellido:</strong> {user.apellido_1}</p>
        <p><strong>Segundo Apellido:</strong> {user.apellido_2}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.rol.nombre}</p>
        <p><strong>Ubicaciones:</strong></p>
        <ul className="list-disc list-inside">
          {user.ubicaciones.map((ubicacion) => (
            <li key={ubicacion.id}>{ubicacion.nombre}</li>
          ))}
        </ul>
        <p><strong>Disponibilidad:</strong> {user.disponibilidad}</p>

        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onClick={onClose}>
            Cerrar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => onEdit(userId)} // Llamar la función onEdit con el ID del usuario
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailUsuarios;
