// src/components/RegisterComponent.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from 'C:/Users/Stward/Desktop/Control_de_aactivos/FronControlActivos/FronCTP/src/assets/images-removebg-preview (1).png';
import backgroundPattern from 'C:/Users/Stward/Desktop/Control_de_aactivos/FronControlActivos/FronCTP/src/assets/Opera Captura de pantalla_2024-09-04_125315_www.figma.com.png'; // Aquí está la imagen de fondo

const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Aquí puedes manejar la lógica de registro (validación, etc.)
    // Después del registro, redirigir al Dashboard o donde prefieras
    navigate('/MenuAdmin');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Panel izquierdo */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-4">REGISTRO</h1>
          <p className="text-center text-neutral-600 mb-8">
            Control de Activos CTP Hojancha
          </p>

          {/* Logo debajo del texto */}
          <div className="flex justify-center mb-6">
            <img
              className="w-48 h-auto"
              src={logo}  // Usando la imagen importada
              alt="Logo CTP Hojancha"
            />
          </div>

          {/* Inputs */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="correo">
              Correo
            </label>
            <input
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              type="email"
              id="correo"
              placeholder="Ingresa tu correo"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-1" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              type="password"
              id="confirmPassword"
              placeholder="Confirma tu contraseña"
            />
          </div>

          {/* Botón de registro */}
          <button
            className="w-full bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-bold p-3 rounded-xl shadow-md hover:bg-indigo-700"
            onClick={handleRegister}
          >
            Registrarse
          </button>
        </div>
      </div>

      {/* Panel derecho con patrón ondulado */}
      <div
        className="relative w-full md:w-1/2 bg-cover bg-center flex justify-center items-center"
        style={{
          backgroundImage: `url(${backgroundPattern})`,
          backgroundSize: 'cover',
        }}
      >
        <h1 className="text-white text-4xl font-bold text-center z-10">
          CONTROL DE ACTIVOS CTP HOJANCHA
        </h1>
      </div>
    </div>
  );
};

export default RegisterComponent;
