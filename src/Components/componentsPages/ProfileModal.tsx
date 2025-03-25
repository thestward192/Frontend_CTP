import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [ubicaciones, setUbicaciones] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.email.split('@')[0] || '');
        setEmail(payload.email || '');
        setUserType(payload.role || '');
        setUbicaciones(payload.ubicaciones || []);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative transform transition-all duration-300">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Perfil de Usuario</h2>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-600">Nombre de usuario</p>
            <p className="text-lg text-gray-800 font-medium">{username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Correo</p>
            <p className="text-lg text-gray-800 font-medium">{email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rol</p>
            <p className="text-lg text-gray-800 font-medium">{userType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ubicaciones</p>
            {ubicaciones.length > 0 ? (
              <ul className="list-disc list-inside text-lg text-gray-800">
                {ubicaciones.map((ubic) => (
                  <li key={ubic.id}>{ubic.nombre}</li>
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

export default ProfileModal;
