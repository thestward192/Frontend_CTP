import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import ChangePassword from '../../Components/componentsPages/ChangePassword';


const ProfileDocenteComponent: React.FC = () => {
  const { nombre, email, ubicaciones, role } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [initial, setInitial] = useState<string>('');
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  useEffect(() => {
    // Obtener la inicial del nombre
    if (nombre) {
      setInitial(nombre.charAt(0).toUpperCase());
    } else if (email) {
      setInitial(email.charAt(0).toUpperCase());
    }
  }, [nombre, email]);

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
            <div>Nombre: {nombre}</div>
            <div className="font-medium truncate">{email}</div>
          </div>
          <div className="px-4 py-2 text-sm text-gray-700">
            <span>Rol: {role}</span>
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
          </button>
        </div>*/}
      </div>
      )}
       {/*
     {showChangePasswordForm && (
        <div className="absolute top-20 right-0 bg-white p-8 border border-gray-200 rounded-md shadow-md w-80">
          <ChangePassword onPasswordChangeSuccess={handlePasswordChangeSuccess} />
        </div>
      )}
      */}
    </div>
  );
};

export default ProfileDocenteComponent;
