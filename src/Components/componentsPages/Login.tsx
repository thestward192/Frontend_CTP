// src/componentsPages/Login.tsx
import React, { useState } from 'react';
import logo from '../../assets/images-removebg-preview (1).png';
import backgroundPattern from '../../assets/Opera Captura de pantalla_2024-09-04_125315_www.figma.com.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError(''); // Limpiar cualquier error previo

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          contraseña: password, // Asegúrate de que "contraseña" es el campo esperado en el backend
        }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      login(data.access_token); // Autenticar y guardar el token

      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      if (payload.role === 'Administrador') {
        navigate('/MenuAdmin'); // Redirigir al menú del administrador
      } else {
        setError('No tienes permisos para acceder a esta área.');
        localStorage.removeItem('token'); // Elimina el token si no es administrador
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Credenciales inválidas o error en el servidor');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-4">ACCESO</h1>
          <p className="text-center text-neutral-600 mb-8">Control de Activos CTP Hojancha</p>
          <div className="flex justify-center mb-6">
            <img className="w-48 h-auto" src={logo} alt="Logo CTP Hojancha" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="email">Correo</label>
            <input
              className="w-full p-3 border rounded-xl"
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-1" htmlFor="password">Contraseña</label>
            <input
              className="w-full p-3 border rounded-xl"
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-bold p-3 rounded-xl"
            onClick={handleLogin}
          >
            Entrar
          </button>

          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </div>

      <div
        className="relative w-full md:w-1/2 bg-cover bg-center flex justify-center items-center"
        style={{ backgroundImage: `url(${backgroundPattern})`, backgroundSize: 'cover' }}
      >
        <h1 className="text-white text-4xl font-bold text-center z-10">CONTROL DE ACTIVOS CTP HOJANCHA</h1>
      </div>
    </div>
  );
};

export default Login;
