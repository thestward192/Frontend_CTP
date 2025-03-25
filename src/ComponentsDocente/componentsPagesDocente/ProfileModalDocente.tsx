import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../../hooks/AuthContext';

interface ProfileModalDocenteProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModalDocente: React.FC<ProfileModalDocenteProps> = ({ isOpen, onClose }) => {
  const { nombre, email, role, ubicaciones } = useAuth();

  useEffect(() => {
    // Puedes agregar efectos adicionales si necesitas actualizar la info cuando se abra el modal
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative transform transition-all duration-300">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Perfil de Docente</h2>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-600">Nombre</p>
            <p className="text-lg text-gray-800 font-medium">{nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Correo</p>
            <p className="text-lg text-gray-800 font-medium">{email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rol</p>
            <p className="text-lg text-gray-800 font-medium">{role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ubicaciones</p>
            {ubicaciones && ubicaciones.length > 0 ? (
              <ul className="list-disc list-inside text-lg text-gray-800">
                {ubicaciones.map((ubicacion) => (
                  <li key={ubicacion.id}>{ubicacion.nombre}</li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-800">No hay ubicaciones registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModalDocente;
