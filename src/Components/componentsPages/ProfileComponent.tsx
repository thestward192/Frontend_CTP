import React, { useState, useEffect } from 'react';

interface ProfileComponentProps {
  username: string;
  email: string;
  userType: string;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ username, email, userType }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [initial, setInitial] = useState<string>('');

  useEffect(() => {
    // Obtener la inicial del nombre
    setInitial(username.charAt(0).toUpperCase());
  }, [username]);

  // Función para alternar el dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    <div className="relative z-50"> {/* Aumentamos el z-index para que esté encima de otros elementos */}
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
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
