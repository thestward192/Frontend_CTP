import React, { useState, useEffect } from 'react';
import ChangePassword from './ChangePassword';

const ProfileComponent: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [initial, setInitial] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [userType, setUserType] = useState<string>('');
  const [ubicaciones, setUbicaciones] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token para obtener los datos del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.email.split('@')[0]); // Suponemos que el username es la parte del correo antes del @
      setEmail(payload.email);
      setUserType(payload.role);
      setUbicaciones(payload.ubicaciones || []); // Obtener las ubicaciones

      // Obtener la inicial del nombre
      setInitial(payload.email.charAt(0).toUpperCase());
    }
  }, []);

  // Función para alternar el dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
 
    const handlePasswordChangeSuccess = () => {
      setShowChangePasswordForm(false);
    };
  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#profileDropdown') && !target.closest('#avatarButton')) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  

  return (
    <div className="relative z-50">
      {/* Botón del avatar con la inicial */}
      <div
        id="avatarButton"
        className="w-10 h-10 rounded-full bg-white text-black-500 border border-gray-300 flex items-center justify-center cursor-pointer"
        onClick={toggleDropdown}
        style={{ position: 'absolute', top: '20px', right: '30px' }}
      >
        {initial}
      </div>

      {/* Dropdown del perfil */}
      {isDropdownOpen && (
        <div
          id="profileDropdown"
          className="absolute top-14 right-0 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44"
          style={{ zIndex: 50 }}
        >
          <div className="px-4 py-3 text-sm text-gray-900">
            <div>{username}</div>
            <div className="font-medium truncate">{email}</div>
          </div>
          <div className="px-4 py-2 text-sm text-gray-700">
            <span>Rol: {userType}</span>
          </div>
          <div className="px-4 py-2 text-sm text-gray-700">
            <span>Ubicaciones:</span>
            <ul>
              {ubicaciones.map((ubicacion) => (
                <li key={ubicacion.id}>{ubicacion.nombre}</li>
              ))}
            </ul>
          </div>
          {/*<button
            className="w-full px-4 py-2 text-sm text-left text-blue-600 hover:underline"
            onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
          >
            Cambiar Contraseña
          </button>*/}
        </div>
      )}
      
  
      {/*showChangePasswordForm && (
        <div className="absolute top-20 right-0 bg-white p-8 border border-gray-200 rounded-md shadow-md w-80">
          <ChangePassword onPasswordChangeSuccess={handlePasswordChangeSuccess} />
        </div>
      )*/}
    </div>
  );
};

export default ProfileComponent;
